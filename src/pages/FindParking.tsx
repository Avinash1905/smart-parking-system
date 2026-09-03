import React, { useState } from 'react';
import { Search, MapPin, Star } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Link } from 'react-router-dom';

export const FindParking: React.FC = () => {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  const lots = [
    {
      id: 1,
      name: 'Downtown Metro Center Deck',
      address: '100 Main St, Central Core',
      rate: '$5.00/hr',
      available: 38,
      total: 100,
      rating: 4.8,
      type: 'ev',
      tags: ['EV Charging', '24/7 Security'],
    },
    {
      id: 2,
      name: 'Uptown Tech Hub Garage',
      address: '742 Cyber Plaza',
      rate: '$4.50/hr',
      available: 15,
      total: 80,
      rating: 4.9,
      type: 'covered',
      tags: ['Covered', 'Touchless QR'],
    },
    {
      id: 3,
      name: 'Harbor Gateway Parking',
      address: '22 Marine Blvd',
      rate: '$3.50/hr',
      available: 64,
      total: 200,
      rating: 4.7,
      type: 'valet',
      tags: ['Valet Support', 'Wide Bays'],
    },
    {
      id: 4,
      name: 'Westside Business Park Lot',
      address: '500 Enterprise Way',
      rate: '$6.00/hr',
      available: 8,
      total: 50,
      rating: 4.9,
      type: 'ev',
      tags: ['Fast EV DC', 'CCTV Grid'],
    },
  ];

  const filteredLots = lots.filter((lot) => {
    const matchesQuery =
      lot.name.toLowerCase().includes(query.toLowerCase()) ||
      lot.address.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filterType === 'all' || lot.type === filterType;
    return matchesQuery && matchesFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-[#080F1C]">
      <div>
        <h1 className="text-3xl font-extrabold text-white">
          Find Live Parking Spaces
        </h1>
        <p className="text-[#94A3B8] text-sm mt-1">
          Explore real-time vacancies, EV chargers, and automated access points across town.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full">
          <Search className="w-5 h-5 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by street name, neighborhood, or facility..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#1F2937] bg-[#111827] text-sm focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/25 text-white placeholder:text-[#94A3B8]"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              filterType === 'all'
                ? 'bg-[#2563EB] text-white'
                : 'bg-[#111827] border border-[#1F2937] text-[#94A3B8]'
            }`}
          >
            All Spaces
          </button>
          <button
            onClick={() => setFilterType('ev')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              filterType === 'ev'
                ? 'bg-[#2563EB] text-white'
                : 'bg-[#111827] border border-[#1F2937] text-[#94A3B8]'
            }`}
          >
            ⚡ EV Charging
          </button>
          <button
            onClick={() => setFilterType('covered')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              filterType === 'covered'
                ? 'bg-[#2563EB] text-white'
                : 'bg-[#111827] border border-[#1F2937] text-[#94A3B8]'
            }`}
          >
            🛡 Covered
          </button>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredLots.map((lot) => (
          <Card key={lot.id} className="p-6 space-y-4 hover:border-[#2563EB]/50 transition-colors bg-[#111827] border-[#1F2937]">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg text-white">{lot.name}</h3>
                <p className="text-xs text-[#94A3B8] flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
                  <span>{lot.address}</span>
                </p>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-[#38BDF8]">{lot.rate}</span>
                <div className="flex items-center gap-1 text-xs text-amber-400 justify-end mt-0.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-semibold">{lot.rating}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#0F172A] border border-[#1F2937]">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#2563EB] animate-ping" />
                <span className="text-xs font-semibold text-[#94A3B8]">
                  {lot.available} of {lot.total} spots available
                </span>
              </div>
              <span className="text-xs font-bold text-[#38BDF8]">
                {Math.round((lot.available / lot.total) * 100)}% Free
              </span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex gap-1.5">
                {lot.tags.map((tag, idx) => (
                  <span key={idx} className="text-[11px] px-2 py-0.5 rounded bg-[#0F172A] border border-[#1F2937] text-[#94A3B8]">
                    {tag}
                  </span>
                ))}
              </div>
              <Link to="/login">
                <Button size="sm" variant="primary" className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white">
                  Reserve Slot
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
