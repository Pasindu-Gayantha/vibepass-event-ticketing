import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Download, Ticket, Loader2, Calendar, MapPin } from 'lucide-react';
import { fetchAllBookings } from '@/lib/data';
import { formatLKR, formatDateFull } from '@/lib/utils';
import type { BookingWithDetails } from '@/types';

interface MyTicketsDrawerProps {
  onClose: () => void;
  refreshKey: number;
}

export default function MyTicketsDrawer({ onClose, refreshKey }: MyTicketsDrawerProps) {
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, [refreshKey]);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const data = await fetchAllBookings();
      setBookings(data);
    } catch (e) {
      console.error('Failed to load bookings', e);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (b: BookingWithDetails) => {
    const content = [
      '═══════════════════════════════════',
      '         VIBEPASS - DIGITAL TICKET',
      '═══════════════════════════════════',
      '',
      `Booking ID: ${b.booking_ref}`,
      `Event: ${b.event?.title || '-'}`,
      `Date: ${b.event ? formatDateFull(b.event.event_date) : '-'}`,
      `Venue: ${b.event?.venue || '-'}, ${b.event?.venue || ''}`,
      `Tier: ${b.tier?.name || '-'}`,
      `Quantity: ${b.quantity}`,
      `Customer: ${b.customer_name}`,
      `Total Paid: ${formatLKR(b.total_amount)}`,
      `Status: ${b.status}`,
      '',
      '═══════════════════════════════════',
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VibePass-Ticket-${b.booking_ref}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const statusStyles: Record<string, string> = {
    confirmed: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    redeemed: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    cancelled: 'bg-red-500/20 text-red-300 border-red-500/30',
  };

  return (
    <div className="fixed inset-0 z-[70] flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-[#0a0a0f]/80 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md h-full bg-[#0a0a0f] border-l border-purple-500/20 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#0a0a0f]/95 backdrop-blur-lg border-b border-purple-500/10 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-rose-400" />
            <h2 className="text-white font-bold text-lg">My Tickets</h2>
            <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold">
              {bookings.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-rose-400 animate-spin" />
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-20">
              <Ticket className="w-12 h-12 text-gray-700 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No tickets booked yet.</p>
              <p className="text-gray-600 text-sm mt-1">Your booked passes will appear here.</p>
            </div>
          ) : (
            bookings.map((b) => (
              <div
                key={b.id}
                className="rounded-2xl border border-purple-500/20 bg-white/[0.03] overflow-hidden"
              >
                {/* Ticket header */}
                <div className="p-4 flex items-start gap-3">
                  {b.event?.banner_url && (
                    <img
                      src={b.event.banner_url}
                      alt={b.event?.title || ''}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-sm truncate">{b.event?.title || 'Event'}</h3>
                    <div className="flex items-center gap-1 text-gray-400 text-xs mt-1">
                      <Calendar className="w-3 h-3" /> {b.event ? formatDateFull(b.event.event_date) : '-'}
                    </div>
                    <div className="flex items-center gap-1 text-gray-400 text-xs mt-0.5">
                      <MapPin className="w-3 h-3" /> {b.event?.venue || '-'}
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border flex-shrink-0 ${statusStyles[b.status] || ''}`}>
                    {b.status}
                  </span>
                </div>

                {/* QR + details */}
                <div className="flex items-center gap-4 p-4 border-t border-purple-500/10 bg-purple-500/[0.03]">
                  <div className="p-2 bg-white rounded-xl flex-shrink-0">
                    <QRCodeSVG
                      value={JSON.stringify({ ref: b.booking_ref, name: b.customer_name, event: b.event?.title, tier: b.tier?.name, qty: b.quantity })}
                      size={80}
                      level="M"
                    />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="text-gray-500 text-[10px] uppercase">Booking ID</div>
                    <div className="text-rose-400 font-mono font-bold text-xs">{b.booking_ref}</div>
                    <div className="text-gray-400 text-xs">
                      {b.tier?.name} × {b.quantity}
                    </div>
                    <div className="text-white font-semibold text-sm">{formatLKR(b.total_amount)}</div>
                  </div>
                </div>

                {/* Action */}
                <div className="p-3 border-t border-purple-500/10">
                  <button
                    onClick={() => handleDownload(b)}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-medium transition-all"
                  >
                    <Download className="w-4 h-4" /> Download
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
