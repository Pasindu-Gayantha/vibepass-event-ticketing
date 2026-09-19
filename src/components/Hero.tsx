import { useState } from 'react';
import { Search, Calendar, MapPin, Music } from 'lucide-react';

interface HeroProps {
  onSearch: (filters: { category: string; location: string; date: string }) => void;
}

const categories = ['All', 'Concerts', 'EDM', 'Acoustic'];

export default function Hero({ onSearch }: HeroProps) {
  const [category, setCategory] = useState('All');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');

  const handleSearch = () => {
    onSearch({
      category: category === 'All' ? '' : category === 'Concerts' ? 'Concert' : category,
      location,
      date,
    });
  };

  return (
    <section className="relative min-h-[620px] flex items-center justify-center overflow-hidden pt-16">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.pexels.com/photos/20419429/pexels-photo-20419429.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Concert crowd with purple lights"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/80 via-[#0a0a0f]/90 to-[#0a0a0f]" />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 via-transparent to-rose-900/30" />
      </div>

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/15 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-rose-500/15 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center py-20">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 backdrop-blur-md border border-purple-500/20 text-rose-400 text-sm font-medium mb-6">
          <Music className="w-4 h-4" />
          Sri Lanka's Premier Concert Ticketing Platform
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4 tracking-tight">
          Live the Sound. <br />
          <span className="bg-gradient-to-r from-rose-400 via-rose-300 to-purple-500 bg-clip-text text-transparent">
            Feel the Energy.
          </span>
        </h1>

        <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-10">
          Discover and book tickets for the most electrifying concerts, EDM festivals, and acoustic nights across Sri Lanka.
        </p>

        {/* Floating Search Bar — capsule style */}
        <div className="bg-[#0a0a0f]/60 backdrop-blur-xl rounded-full border border-purple-500/30 shadow-2xl shadow-purple-500/10 p-2 max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row items-stretch gap-2">
            {/* Category */}
            <div className="flex-1 text-left">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-transparent px-4 py-2.5 text-white text-sm focus:outline-none cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c} value={c} className="bg-[#0a0a0f]">{c}</option>
                ))}
              </select>
            </div>

            <div className="hidden sm:block w-px bg-purple-500/20" />

            {/* Location */}
            <div className="flex-1 text-left">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location or Venue"
                className="w-full bg-transparent px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none"
              />
            </div>

            <div className="hidden sm:block w-px bg-purple-500/20" />

            {/* Date */}
            <div className="flex-1 text-left">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-transparent px-4 py-2.5 text-white text-sm focus:outline-none [color-scheme:dark]"
              />
            </div>

            {/* Search button */}
            <button
              onClick={handleSearch}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-400 hover:to-purple-500 text-white font-bold px-6 py-2.5 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/25"
            >
              <Search className="w-5 h-5" />
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>
        </div>

        {/* Search icons hint */}
        <div className="flex items-center justify-center gap-6 mt-6 text-gray-500 text-xs">
          <span className="flex items-center gap-1"><Music className="w-3 h-3" /> Category</span>
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Location</span>
          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Date</span>
        </div>
      </div>
    </section>
  );
}
