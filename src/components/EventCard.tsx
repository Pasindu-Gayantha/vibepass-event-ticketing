import { Calendar, MapPin, Ticket } from 'lucide-react';
import type { VibeEvent } from '@/types';
import { formatLKR, formatDate, getUrgencyLabel } from '@/lib/utils';

interface EventCardProps {
  event: VibeEvent;
  onClick: () => void;
}

const urgencyStyles: Record<string, string> = {
  red: 'bg-red-500/20 text-red-300 border-red-500/30',
  rose: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  emerald: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
};

const categoryStyles: Record<string, string> = {
  Concert: 'bg-cyan-500/20 text-cyan-300',
  EDM: 'bg-purple-500/20 text-purple-300',
  Acoustic: 'bg-emerald-500/20 text-emerald-300',
};

export default function EventCard({ event, onClick }: EventCardProps) {
  const urgency = getUrgencyLabel(event);

  return (
    <button
      onClick={onClick}
      className="group relative text-left w-full overflow-hidden rounded-2xl border border-purple-500/15 bg-white/[0.03] backdrop-blur-md transition-all duration-300 hover:border-rose-500/40 hover:shadow-lg hover:shadow-purple-500/20 hover:-translate-y-1"
    >
      {/* Banner */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.banner_url}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/40 to-transparent" />

        {/* Date Badge */}
        <div className="absolute top-3 left-3 bg-[#0a0a0f]/80 backdrop-blur-md rounded-xl px-3 py-2 border border-purple-500/20 text-center">
          <div className="text-rose-400 text-xs font-semibold uppercase">
            {formatDate(event.event_date).split(' ')[0]}
          </div>
          <div className="text-white text-lg font-bold leading-none">
            {new Date(event.event_date).getDate()}
          </div>
          <div className="text-gray-400 text-[10px] uppercase">
            {new Date(event.event_date).toLocaleDateString('en-US', { month: 'short' })}
          </div>
        </div>

        {/* Category Badge */}
        <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${categoryStyles[event.category]}`}>
          {event.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-white font-bold text-lg leading-tight group-hover:text-rose-400 transition-colors">
            {event.title}
          </h3>
          <div className="flex items-center gap-1.5 text-gray-400 text-sm mt-1">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{event.venue}, {event.location}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-400 text-sm mt-0.5">
            <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{formatDate(event.event_date)}</span>
          </div>
        </div>

        {/* Lineup */}
        <p className="text-gray-500 text-xs truncate">
          {event.lineup.slice(0, 3).join(' · ')}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-purple-500/10">
          <div className="flex items-center gap-1.5">
            <Ticket className="w-4 h-4 text-rose-400" />
            <div>
              <div className="text-gray-500 text-[10px] uppercase">From</div>
              <div className="text-white font-bold text-sm">{formatLKR(event.starting_price)}</div>
            </div>
          </div>
          <div className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${urgencyStyles[urgency.color]}`}>
            {urgency.text}
          </div>
        </div>
      </div>
    </button>
  );
}
