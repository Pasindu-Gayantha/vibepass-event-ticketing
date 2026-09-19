import { supabase } from '@/lib/supabase';
import type { VibeEvent, TicketTier, Booking, OrganizerInquiry, BookingWithDetails } from '@/types';


export async function fetchEvents(): Promise<VibeEvent[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*, ticket_tiers(price)')
    .in('status', ['published', 'active'])
    .order('event_date', { ascending: true });

  if (error) throw error;

  return ((data ?? []) as any[]).map((e) => {
    let minPrice = Number(e.starting_price || e.price || 0);

   
    if ((!minPrice || isNaN(minPrice)) && Array.isArray(e.ticket_tiers) && e.ticket_tiers.length > 0) {
      const prices = e.ticket_tiers
        .map((t: any) => Number(t.price))
        .filter((p: number) => !isNaN(p) && p > 0);
      if (prices.length > 0) {
        minPrice = Math.min(...prices);
      }
    }

    return {
      ...e,
      starting_price: minPrice > 0 ? minPrice : 2500,
    };
  }) as VibeEvent[];
}

export async function fetchEventTiers(eventId: string): Promise<TicketTier[]> {
  const { data, error } = await supabase
    .from('ticket_tiers')
    .select('*')
    .eq('event_id', eventId)
    .order('price', { ascending: true });
  if (error) throw error;
  return (data ?? []) as TicketTier[];
}

export async function fetchEventWithTiers(eventId: string): Promise<{ event: VibeEvent | null; tiers: TicketTier[] }> {
  const [eventRes, tiersRes] = await Promise.all([
    supabase.from('events').select('*').eq('id', eventId).maybeSingle(),
    supabase.from('ticket_tiers').select('*').eq('event_id', eventId).order('price', { ascending: true }),
  ]);
  if (eventRes.error) throw eventRes.error;
  if (tiersRes.error) throw tiersRes.error;
  return {
    event: (eventRes.data as VibeEvent) ?? null,
    tiers: (tiersRes.data ?? []) as TicketTier[],
  };
}

export async function createBooking(
  booking: Omit<Booking, 'id' | 'created_at' | 'status'> & { status?: string }
): Promise<Booking> {
  const { data, error } = await supabase
    .from('bookings')
    .insert({ ...booking, status: booking.status ?? 'confirmed' })
    .select()
    .single();
  if (error) throw error;
  return data as Booking;
}

export async function fetchBookingByRef(ref: string): Promise<BookingWithDetails | null> {
  const { data, error } = await supabase
    .from('bookings')
    .select(
      `*, event:events(title, venue, event_date, banner_url), tier:ticket_tiers(name, price)`
    )
    .eq('booking_ref', ref)
    .maybeSingle();
  if (error) throw error;
  return (data as BookingWithDetails) ?? null;
}

export async function fetchAllBookings(): Promise<BookingWithDetails[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select(
      `*, event:events(title, venue, event_date, banner_url), tier:ticket_tiers(name, price)`
    )
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as BookingWithDetails[];
}

export async function fetchRecentBookings(limit = 10): Promise<BookingWithDetails[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select(
      `*, event:events(title, venue, event_date, banner_url), tier:ticket_tiers(name, price)`
    )
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as BookingWithDetails[];
}

export async function fetchInquiries(): Promise<OrganizerInquiry[]> {
  const { data, error } = await supabase
    .from('organizer_inquiries')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as OrganizerInquiry[];
}

export async function createInquiry(
  inquiry: Omit<OrganizerInquiry, 'id' | 'created_at' | 'status'>
): Promise<OrganizerInquiry> {
  const { data, error } = await supabase
    .from('organizer_inquiries')
    .insert({ ...inquiry, status: 'pending' })
    .select()
    .single();
  if (error) throw error;
  return data as OrganizerInquiry;
}

export async function updateInquiryStatus(id: string, status: string): Promise<void> {
  const { error } = await supabase
    .from('organizer_inquiries')
    .update({ status })
    .eq('id', id);
  if (error) throw error;
}

export async function fetchAdminStats(): Promise<{
  totalRevenue: number;
  ticketsSold: number;
  activeConcerts: number;
  pendingInquiries: number;
}> {
  const [bookingsRes, eventsRes, inquiriesRes] = await Promise.all([
    supabase.from('bookings').select('total_amount, quantity, status'),
    supabase.from('events').select('id, status').in('status', ['published', 'active']),
    supabase.from('organizer_inquiries').select('id, status').eq('status', 'pending'),
  ]);

  if (bookingsRes.error) throw bookingsRes.error;
  if (eventsRes.error) throw eventsRes.error;
  if (inquiriesRes.error) throw inquiriesRes.error;

  const confirmedBookings = (bookingsRes.data ?? []).filter((b) => b.status !== 'cancelled');
  const totalRevenue = confirmedBookings.reduce((sum, b) => sum + Number(b.total_amount), 0);
  const ticketsSold = confirmedBookings.reduce((sum, b) => sum + b.quantity, 0);

  return {
    totalRevenue,
    ticketsSold,
    activeConcerts: eventsRes.data?.length ?? 0,
    pendingInquiries: inquiriesRes.data?.length ?? 0,
  };
}

export async function validateTicket(ref: string): Promise<{ found: boolean; status: string | null }> {
  const { data, error } = await supabase
    .from('bookings')
    .select('status')
    .eq('booking_ref', ref)
    .maybeSingle();
  if (error) throw error;
  if (!data) return { found: false, status: null };
  return { found: true, status: data.status };
}

export async function redeemTicket(ref: string): Promise<void> {
  const { error } = await supabase
    .from('bookings')
    .update({ status: 'redeemed' })
    .eq('booking_ref', ref)
    .eq('status', 'confirmed');
  if (error) throw error;
}

export function generateBookingRef(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(100000 + Math.random() * 900000);
  return `VP-${year}-${random}`;
}