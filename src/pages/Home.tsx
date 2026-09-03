import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Star, 
  ArrowRight,
  Sparkles,
  Navigation
} from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

export const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const featuredSpots = [
    {
      id: 1,
      name: 'Grand Central Smart Hub',
      address: '452 Lexington Ave, Midtown',
      rate: '$6.50/hr',
      available: 24,
      total: 120,
      rating: 4.9,
      tags: ['EV Fast Charging', 'Covered', '24/7 Security'],
      image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 2,
      name: 'Financial District Plaza Deck',
      address: '88 Pine St, Wall St District',
      rate: '$8.00/hr',
      available: 12,
      total: 80,
      rating: 4.8,
      tags: ['Auto-Gate Access', 'CCTV', 'Valet Optional'],
      image: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 3,
      name: 'Tech District EcoPark',
      address: '300 Silicon Boulevard',
      rate: '$4.00/hr',
      available: 45,
      total: 150,
      rating: 5.0,
      tags: ['Solar Powered', 'Touchless', 'Bicycle Lockers'],
      image: 'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=600&q=80',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#080F1C]">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 bg-grid-pattern">
        {/* Glow ambient background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#2563EB]/15 blur-[120px] rounded-full pointer-events-none -z-10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0F172A] border border-[#1F2937] text-[#38BDF8] text-xs sm:text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4 text-[#38BDF8]" />
            <span>Next-Generation AI Parking Grid &bull; Live in 14 Cities</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none">
            Smart, Seamless &amp;{' '}
            <span className="bg-gradient-to-r from-white via-[#38BDF8] to-[#2563EB] bg-clip-text text-transparent">
              Stress-Free Parking
            </span>
          </h1>

          {/* Subheading */}
          <p className="mt-6 text-lg sm:text-xl text-[#94A3B8] max-w-2xl mx-auto leading-relaxed">
            Find, reserve, and pay for verified parking spaces in real-time with automated license plate recognition and zero waiting.
          </p>

          {/* Interactive Search Bar Box */}
          <div className="mt-10 max-w-3xl mx-auto">
            <Card glass className="p-3 sm:p-4 bg-[#111827] border-[#1F2937] shadow-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                <div className="sm:col-span-8 relative">
                  <MapPin className="w-5 h-5 text-[#38BDF8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter city, landmark, or street name..."
                    className="w-full pl-11 pr-4 py-3 bg-[#080F1C] border border-[#1F2937] rounded-xl text-sm focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/25 text-white placeholder:text-[#94A3B8]"
                  />
                </div>
                <div className="sm:col-span-4">
                  <Link to="/find-parking">
                    <Button variant="primary" size="md" className="w-full py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white">
                      <Search className="w-4 h-4" />
                      <span>Find Spaces</span>
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Quick Filter Badges */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4 pt-3 border-t border-[#1F2937] text-xs text-[#94A3B8]">
                <span className="font-semibold text-white">Quick Filters:</span>
                <span className="px-2.5 py-1 rounded-lg bg-[#0F172A] border border-[#1F2937] hover:text-[#38BDF8] cursor-pointer transition-colors">⚡ EV Charging</span>
                <span className="px-2.5 py-1 rounded-lg bg-[#0F172A] border border-[#1F2937] hover:text-[#38BDF8] cursor-pointer transition-colors">🛡 Covered / Secure</span>
                <span className="px-2.5 py-1 rounded-lg bg-[#0F172A] border border-[#1F2937] hover:text-[#38BDF8] cursor-pointer transition-colors">🏷 Monthly Discounts</span>
              </div>
            </Card>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-16 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl bg-[#111827] border border-[#1F2937]">
              <p className="text-3xl font-extrabold text-[#38BDF8]">25,000+</p>
              <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">Smart Spots Connected</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#111827] border border-[#1F2937]">
              <p className="text-3xl font-extrabold text-[#38BDF8]">99.8%</p>
              <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">Sensor Accuracy</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#111827] border border-[#1F2937]">
              <p className="text-3xl font-extrabold text-[#38BDF8]">4.5 Min</p>
              <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">Avg Search Time Saved</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#111827] border border-[#1F2937]">
              <p className="text-3xl font-extrabold text-[#38BDF8]">4.9 / 5</p>
              <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">Driver Satisfaction</p>
            </div>
          </div>

        </div>
      </section>

      {/* Featured Spaces Section */}
      <section className="py-16 bg-[#080F1C] border-y border-[#1F2937]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="flex items-center gap-2 text-[#38BDF8] text-xs font-bold uppercase tracking-wider">
                <Navigation className="w-4 h-4" />
                <span>Live Availability</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                Popular Urban Parking Hubs
              </h2>
            </div>
            <Link to="/find-parking" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#38BDF8] hover:underline">
              <span>View all 140+ locations</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredSpots.map((spot) => (
              <Card key={spot.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-[#111827] border-[#1F2937]">
                <div className="relative h-48 w-full bg-[#0F172A] overflow-hidden">
                  <img
                    src={spot.image}
                    alt={spot.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-[#0F172A]/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-white flex items-center gap-1 shadow-sm border border-[#1F2937]">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>{spot.rating}</span>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-[#2563EB]/95 text-white backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    <span>{spot.available} spots open</span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg text-white line-clamp-1">{spot.name}</h3>
                    <span className="font-bold text-[#38BDF8] text-sm whitespace-nowrap ml-2">
                      {spot.rate}
                    </span>
                  </div>

                  <p className="text-xs text-[#94A3B8] flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
                    <span className="line-clamp-1">{spot.address}</span>
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#1F2937]">
                    {spot.tags.map((t, idx) => (
                      <span key={idx} className="text-[11px] font-medium px-2 py-0.5 rounded bg-[#0F172A] border border-[#1F2937] text-[#94A3B8]">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2">
                    <Link to="/login" className="block">
                      <Button variant="outline" size="sm" className="w-full border-[#2563EB] text-[#38BDF8] hover:bg-[#2563EB]/10">
                        Reserve Slot Now
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-[#080F1C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            How SmartPark Works
          </h2>
          <p className="mt-3 text-[#94A3B8] max-w-xl mx-auto text-sm sm:text-base">
            Eliminate circling for parking with 3 simple steps powered by our smart IoT infrastructure.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14">
            <div className="flex flex-col items-center p-6 rounded-2xl bg-[#111827] border border-[#1F2937]">
              <div className="w-14 h-14 rounded-2xl bg-[#1E40AF] text-[#38BDF8] flex items-center justify-center font-bold text-xl mb-4 shadow-sm">
                1
              </div>
              <h3 className="font-bold text-lg text-white">Locate &amp; Reserve</h3>
              <p className="text-sm text-[#94A3B8] mt-2">
                Open SmartPark on your phone or web app to see real-time vacant spaces near your destination.
              </p>
            </div>

            <div className="flex flex-col items-center p-6 rounded-2xl bg-[#111827] border border-[#1F2937]">
              <div className="w-14 h-14 rounded-2xl bg-[#1E40AF] text-[#38BDF8] flex items-center justify-center font-bold text-xl mb-4 shadow-sm">
                2
              </div>
              <h3 className="font-bold text-lg text-white">Drive In Seamlessly</h3>
              <p className="text-sm text-[#94A3B8] mt-2">
                Automated license plate recognition scans your vehicle at the boom barrier. No tickets needed.
              </p>
            </div>

            <div className="flex flex-col items-center p-6 rounded-2xl bg-[#111827] border border-[#1F2937]">
              <div className="w-14 h-14 rounded-2xl bg-[#1E40AF] text-[#38BDF8] flex items-center justify-center font-bold text-xl mb-4 shadow-sm">
                3
              </div>
              <h3 className="font-bold text-lg text-white">Autopay &amp; Depart</h3>
              <p className="text-sm text-[#94A3B8] mt-2">
                Drive out when finished. Exact duration is calculated automatically and billed to your digital wallet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-gradient-to-r from-[#0F172A] via-[#1E40AF] to-[#2563EB] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold">
            Ready for a Frictionless Parking Experience?
          </h2>
          <p className="max-w-xl mx-auto text-[#94A3B8] text-sm sm:text-base">
            Join over 100,000 drivers and enterprise parking managers enjoying stress-free parking every day.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link to="/login">
              <Button size="lg" className="bg-white text-[#0F172A] hover:bg-slate-100 shadow-xl w-full sm:w-auto font-bold">
                Sign In to SmartPark
              </Button>
            </Link>
            <Link to="/register">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 w-full sm:w-auto">
                Create Free Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
