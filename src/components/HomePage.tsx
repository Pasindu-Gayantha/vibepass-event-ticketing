import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import type { VibeEvent } from '@/types';
import Hero from '@/components/Hero';
import TrendingCarousel from '@/components/TrendingCarousel';
import CategoryPills from '@/components/CategoryPills';
import EventCard from '@/components/EventCard';
import ValueProps from '@/components/ValueProps';

interface HomePageProps {
  events: VibeEvent[];
  onEventClick: (event: VibeEvent) => void;
  initialCategory?: string;
}

export default function HomePage({ events, onEventClick, initialCategory = '' }: HomePageProps) {
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchFilters, setSearchFilters] = useState({ category: '', location: '', date: '' });

  const handleSearch = (filters: { category: string; location: string; date: string }) => {
    setSearchFilters(filters);
    setActiveCategory(filters.category);
    const grid = document.getElementById('events-grid');
    grid?.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const cat = (e as any).category || '';
      if (activeCategory && cat !== activeCategory) return false;
      if (searchFilters.location) {
        const loc = searchFilters.location.toLowerCase();
        const eventLoc = ((e as any).location || '').toLowerCase();
        const eventVenue = (e.venue || '').toLowerCase();
        if (!eventLoc.includes(loc) && !eventVenue.includes(loc)) return false;
      }
      if (searchFilters.date && e.event_date) {
        const eventDate = new Date(e.event_date).toISOString().split('T')[0];
        if (eventDate !== searchFilters.date) return false;
      }
      return true;
    });
  }, [events, activeCategory, searchFilters]);

  return (
    <div className="w-full min-h-screen">
      <Hero onSearch={handleSearch} />

      {/* Trending Carousel Container - Screen එකට ගැළපෙන පරිදි පුළුල් කර ඇත */}
      <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-10">
        <TrendingCarousel events={events} onEventClick={onEventClick} />
      </div>

      {/* Events Section */}
      <section id="events-grid" className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-10 py-12 scroll-mt-20">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            {activeCategory ? activeCategory === 'Concert' ? 'Concerts' : activeCategory === 'EDM' ? 'EDM Festivals' : 'Acoustic Nights' : 'Popular Events'}
          </h2>
          <p className="text-gray-400">Book your spot at Sri Lanka's hottest live music events</p>
        </div>

        <div className="mb-8">
          <CategoryPills active={activeCategory} onSelect={setActiveCategory} />
        </div>

        {filteredEvents.length === 0 ? (
          <div className="text-center py-20">
            <Search className="w-12 h-12 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No events match your search. Try different filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} onClick={() => onEventClick(event)} />
            ))}
          </div>
        )}
      </section>

      <ValueProps />
    </div>
  );
}