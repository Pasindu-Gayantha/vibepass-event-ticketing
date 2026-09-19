import { useState, useEffect } from 'react';
import Navbar, { type NavView } from '@/components/Navbar';
import PromoBar from '@/components/PromoBar';
import HomePage from '@/components/HomePage';
import EventDetailModal from '@/components/EventDetailModal';
import CheckoutModal from '@/components/CheckoutModal';
import ConfirmationScreen from '@/components/ConfirmationScreen';
import OrganizerForm from '@/components/OrganizerForm';
import AdminDashboard from '@/components/AdminDashboard';
import AdminLoginModal from '@/components/AdminLoginModal';
import OffersPage from '@/components/OffersPage';
import MyTicketsDrawer from '@/components/MyTicketsDrawer';
import Footer from '@/components/Footer';
import { fetchEvents, fetchEventWithTiers, createBooking, generateBookingRef, fetchAllBookings } from '@/lib/data';
import type { VibeEvent, TicketTier } from '@/types';

type Screen = 'main' | 'confirmation';

interface CheckoutData {
  tier: TicketTier;
  quantity: number;
  promoCode: string;
  subtotal: number;
  discount: number;
  total: number;
}

interface ConfirmationData {
  event: VibeEvent;
  tier: TicketTier;
  quantity: number;
  total: number;
  bookingRef: string;
  customerName: string;
  paymentMethod: string;
}

export default function App() {
  const [view, setView] = useState<NavView>('home');
  const [screen, setScreen] = useState<Screen>('main');
  const [events, setEvents] = useState<VibeEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [initialCategory, setInitialCategory] = useState('');

  // Admin auth
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  // My Tickets
  const [showMyTickets, setShowMyTickets] = useState(false);
  const [ticketCount, setTicketCount] = useState(0);
  const [ticketsRefreshKey, setTicketsRefreshKey] = useState(0);

  // Event detail modal
  const [selectedEvent, setSelectedEvent] = useState<VibeEvent | null>(null);
  const [tiers, setTiers] = useState<TicketTier[]>([]);
  const [tiersLoading, setTiersLoading] = useState(false);

  // Checkout modal
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);

  // Confirmation
  const [confirmationData, setConfirmationData] = useState<ConfirmationData | null>(null);

  useEffect(() => {
    loadEvents();
    loadTicketCount();
  }, []);

  const loadEvents = async () => {
    setEventsLoading(true);
    try {
      const data = await fetchEvents();
      setEvents(data);
    } catch (e) {
      console.error('Failed to load events', e);
    } finally {
      setEventsLoading(false);
    }
  };

  const loadTicketCount = async () => {
    try {
      const bookings = await fetchAllBookings();
      setTicketCount(bookings.length);
    } catch {
      setTicketCount(0);
    }
  };

  const handleNavigate = (v: NavView) => {
    setView(v);
    setScreen('main');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategorySelect = (category: string) => {
    setInitialCategory(category);
  };

  const handleAdminAccess = () => {
    if (isAdmin) {
      setView('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setShowAdminLogin(true);
    }
  };

  const handleAdminLoginSuccess = () => {
    setIsAdmin(true);
    setShowAdminLogin(false);
    setView('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLogOut = () => {
    setIsAdmin(false);
    setView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMyTickets = () => {
    setTicketsRefreshKey((k) => k + 1);
    setShowMyTickets(true);
  };

  const handleEventClick = async (event: VibeEvent) => {
    setSelectedEvent(event);
    setTiers([]);
    setTiersLoading(true);
    try {
      const { tiers: t } = await fetchEventWithTiers(event.id);
      setTiers(t);
    } catch (e) {
      console.error('Failed to load tiers', e);
    } finally {
      setTiersLoading(false);
    }
  };

  const handleBook = (tier: TicketTier, quantity: number, promoCode: string, subtotal: number, discount: number, total: number) => {
    setCheckoutData({ tier, quantity, promoCode, subtotal, discount, total });
  };

  const handleCheckoutConfirm = async (details: { name: string; email: string; mobile: string; paymentMethod: 'card' | 'lankaqr' }) => {
    if (!selectedEvent || !checkoutData) return;

    const bookingRef = generateBookingRef();

    await createBooking({
      event_id: selectedEvent.id,
      tier_id: checkoutData.tier.id,
      customer_name: details.name,
      email: details.email,
      mobile: details.mobile,
      payment_method: details.paymentMethod,
      quantity: checkoutData.quantity,
      subtotal: checkoutData.subtotal,
      discount: checkoutData.discount,
      total_amount: checkoutData.total,
      promo_code: checkoutData.promoCode || null,
      booking_ref: bookingRef,
    });

    setConfirmationData({
      event: selectedEvent,
      tier: checkoutData.tier,
      quantity: checkoutData.quantity,
      total: checkoutData.total,
      bookingRef,
      customerName: details.name,
      paymentMethod: details.paymentMethod,
    });

    setCheckoutData(null);
    setSelectedEvent(null);
    setScreen('confirmation');
    loadTicketCount();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToEvents = () => {
    setScreen('main');
    setConfirmationData(null);
    setView('home');
    loadEvents();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <Navbar
        view={view}
        isAdmin={isAdmin}
        ticketCount={ticketCount}
        onNavigate={handleNavigate}
        onCategorySelect={handleCategorySelect}
        onMyTickets={handleMyTickets}
        onAdminAccess={handleAdminAccess}
      />

      {view === 'home' && screen === 'main' && (
        <>
          <PromoBar />
          {eventsLoading ? (
            <div className="min-h-screen flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-rose-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <HomePage
              events={events}
              onEventClick={handleEventClick}
              initialCategory={initialCategory}
            />
          )}
        </>
      )}

      {view === 'home' && screen === 'confirmation' && confirmationData && (
        <ConfirmationScreen
          event={confirmationData.event}
          tier={confirmationData.tier}
          quantity={confirmationData.quantity}
          total={confirmationData.total}
          bookingRef={confirmationData.bookingRef}
          customerName={confirmationData.customerName}
          paymentMethod={confirmationData.paymentMethod}
          onBackToEvents={handleBackToEvents}
        />
      )}

      {view === 'organizer' && <OrganizerForm />}
      {view === 'admin' && isAdmin && <AdminDashboard onLogOut={handleAdminLogOut} />}
      {view === 'admin' && !isAdmin && (
        <div className="min-h-screen pt-20 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-400 text-lg">Access denied. Please log in.</p>
            <button
              onClick={() => setShowAdminLogin(true)}
              className="mt-4 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 text-white font-bold transition-all hover:shadow-lg hover:shadow-purple-500/25"
            >
              Admin Login
            </button>
          </div>
        </div>
      )}
      {view === 'offers' && <OffersPage />}

      {/* Event Detail Modal */}
      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          tiers={tiers}
          loading={tiersLoading}
          onClose={() => setSelectedEvent(null)}
          onBook={handleBook}
        />
      )}

      {/* Checkout Modal */}
      {selectedEvent && checkoutData && (
        <CheckoutModal
          event={selectedEvent}
          tier={checkoutData.tier}
          quantity={checkoutData.quantity}
          subtotal={checkoutData.subtotal}
          discount={checkoutData.discount}
          total={checkoutData.total}
          promoCode={checkoutData.promoCode}
          onClose={() => setCheckoutData(null)}
          onConfirm={handleCheckoutConfirm}
        />
      )}

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <AdminLoginModal
          onClose={() => setShowAdminLogin(false)}
          onSuccess={handleAdminLoginSuccess}
        />
      )}

      {/* My Tickets Drawer */}
      {showMyTickets && (
        <MyTicketsDrawer
          onClose={() => setShowMyTickets(false)}
          refreshKey={ticketsRefreshKey}
        />
      )}

      {/* Footer */}
      {view !== 'admin' && (
        <Footer onNavigate={handleNavigate} onCategorySelect={handleCategorySelect} />
      )}
    </div>
  );
}
