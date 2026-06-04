import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Users,
  Car,
  DollarSign,
  Activity,
  CheckCircle,
  Clock,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge, BookingStatusBadge, DriverStatusBadge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import type { Booking, Driver } from '@/types';
import { format } from 'date-fns';

const VEHICLE_LABELS: Record<string, string> = {
  standard_sedan: 'Standard Sedan',
  business_sedan: 'Business Sedan',
  first_class_suv: 'First Class SUV',
  luxury_van: 'Luxury Van',
};

const AdminDashboardPage: React.FC = () => {
  const { profile, isAuthenticated, isInitialized } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'bookings' | 'drivers' | 'cities'>('bookings');

  useEffect(() => {
    if (profile?.role === 'admin') {
      loadData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [bookingsRes, driversRes] = await Promise.all([
        supabase.from('bookings').select('*').order('created_at', { ascending: false }).limit(50),
        supabase.from('drivers').select('*').order('created_at', { ascending: false }),
      ]);
      if (bookingsRes.data) setBookings(bookingsRes.data as Booking[]);
      if (driversRes.data) setDrivers(driversRes.data as Driver[]);
    } catch (err) {
      console.error('Admin data load error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isInitialized) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated || profile?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const stats = {
    totalBookings: bookings.length,
    pendingBookings: bookings.filter((b) => b.status === 'pending').length,
    activeRides: bookings.filter((b) => ['en_route', 'arrived', 'in_progress'].includes(b.status)).length,
    todayRevenue: bookings
      .filter((b) => b.status === 'completed' && b.dropoff_at &&
        format(new Date(b.dropoff_at), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd'))
      .reduce((sum, b) => sum + b.total_price, 0),
    activeDrivers: drivers.filter((d) => d.status === 'active' && d.is_online).length,
    pendingApplications: drivers.filter((d) => d.status === 'pending_review').length,
  };

  return (
    <Layout>
      <Helmet>
        <title>Admin Dashboard — BookAirportRide</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="min-h-screen bg-sea-salt-50 py-10">
        <div className="container-luxury">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-cinzel text-3xl font-semibold text-brand-black mb-1">
                Admin Dashboard
              </h1>
              <p className="font-cormorant text-xl text-brand-black-400">
                BookAirportRide Operations Overview
              </p>
            </div>
            <Button
              variant="secondary"
              size="md"
              onClick={loadData}
              leftIcon={<RefreshCw className="h-4 w-4" />}
            >
              Refresh
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {[
              { label: 'Total Bookings', value: stats.totalBookings, icon: Activity, badge: null },
              { label: 'Pending Bookings', value: stats.pendingBookings, icon: Clock, badge: stats.pendingBookings > 0 ? 'warning' : null },
              { label: 'Active Rides', value: stats.activeRides, icon: Car, badge: stats.activeRides > 0 ? 'info' : null },
              { label: "Today's Revenue", value: `$${stats.todayRevenue.toFixed(0)}`, icon: DollarSign, badge: null },
              { label: 'Drivers Online', value: stats.activeDrivers, icon: Users, badge: null },
              { label: 'Pending Driver Apps', value: stats.pendingApplications, icon: AlertCircle, badge: stats.pendingApplications > 0 ? 'warning' : null },
            ].map(({ label, value, icon: Icon, badge }) => (
              <Card key={label} padding="md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-sea-salt-100 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-4 w-4 text-terra-cotta-500" />
                    </div>
                    <div>
                      <p className="font-josefin text-[10px] uppercase tracking-wider text-brand-black-400">
                        {label}
                      </p>
                      <p className="font-cinzel text-2xl font-semibold text-brand-black">{value}</p>
                    </div>
                  </div>
                  {badge && (
                    <Badge variant={badge as 'warning' | 'info'} size="sm">!</Badge>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-0 mb-6 border-b border-sea-salt-200">
            {(['bookings', 'drivers', 'cities'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={[
                  'px-6 py-3 font-josefin text-xs uppercase tracking-wider transition-colors duration-200 border-b-2',
                  activeTab === tab
                    ? 'border-terra-cotta-500 text-terra-cotta-500'
                    : 'border-transparent text-brand-black-400 hover:text-brand-black',
                ].join(' ')}
              >
                {tab}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <>
              {/* Bookings Table */}
              {activeTab === 'bookings' && (
                <div className="bg-warm-white border border-sea-salt-200 overflow-x-auto">
                  <table className="w-full min-w-[700px]">
                    <thead className="bg-sea-salt-50 border-b border-sea-salt-200">
                      <tr>
                        {['Reference', 'Passenger', 'Vehicle', 'Scheduled', 'Total', 'Status', 'Actions'].map((col) => (
                          <th key={col} className="px-4 py-3 text-left font-josefin text-[10px] uppercase tracking-wider text-brand-black-400">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sea-salt-100">
                      {bookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-sea-salt-50 transition-colors">
                          <td className="px-4 py-3 font-cinzel text-sm text-terra-cotta-500">
                            {booking.reference_number}
                          </td>
                          <td className="px-4 py-3">
                            <p className="font-josefin text-xs text-brand-black">{booking.passenger_name}</p>
                            <p className="font-josefin text-[10px] text-brand-black-400">{booking.passenger_email}</p>
                          </td>
                          <td className="px-4 py-3 font-josefin text-xs text-brand-black">
                            {VEHICLE_LABELS[booking.vehicle_class] ?? booking.vehicle_class}
                          </td>
                          <td className="px-4 py-3 font-josefin text-xs text-brand-black">
                            {format(new Date(booking.scheduled_at), 'MMM d, h:mm a')}
                          </td>
                          <td className="px-4 py-3 font-cinzel text-sm font-medium text-brand-black">
                            ${booking.total_price.toFixed(0)}
                          </td>
                          <td className="px-4 py-3">
                            <BookingStatusBadge status={booking.status} />
                          </td>
                          <td className="px-4 py-3">
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {bookings.length === 0 && (
                        <tr>
                          <td colSpan={7} className="px-4 py-8 text-center font-cormorant text-lg text-brand-black-400">
                            No bookings found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Drivers Table */}
              {activeTab === 'drivers' && (
                <div className="bg-warm-white border border-sea-salt-200 overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead className="bg-sea-salt-50 border-b border-sea-salt-200">
                      <tr>
                        {['Driver', 'Vehicle', 'Rating', 'Rides', 'Status', 'Online', 'Actions'].map((col) => (
                          <th key={col} className="px-4 py-3 text-left font-josefin text-[10px] uppercase tracking-wider text-brand-black-400">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sea-salt-100">
                      {drivers.map((driver) => (
                        <tr key={driver.id} className="hover:bg-sea-salt-50 transition-colors">
                          <td className="px-4 py-3">
                            <p className="font-josefin text-xs text-brand-black">
                              {driver.first_name} {driver.last_name}
                            </p>
                            <p className="font-josefin text-[10px] text-brand-black-400">{driver.email}</p>
                          </td>
                          <td className="px-4 py-3">
                            <p className="font-josefin text-xs text-brand-black">
                              {driver.vehicle_year} {driver.vehicle_make} {driver.vehicle_model}
                            </p>
                            <p className="font-josefin text-[10px] text-brand-black-400">
                              {VEHICLE_LABELS[driver.vehicle_class]}
                            </p>
                          </td>
                          <td className="px-4 py-3 font-josefin text-xs text-brand-black">
                            {driver.rating?.toFixed(1) ?? '—'}
                          </td>
                          <td className="px-4 py-3 font-josefin text-xs text-brand-black">
                            {driver.total_rides ?? 0}
                          </td>
                          <td className="px-4 py-3">
                            <DriverStatusBadge status={driver.status} />
                          </td>
                          <td className="px-4 py-3">
                            <span className={`w-2.5 h-2.5 rounded-full inline-block ${driver.is_online ? 'bg-green-400' : 'bg-sea-salt-300'}`} />
                          </td>
                          <td className="px-4 py-3">
                            <Button variant="ghost" size="sm">
                              Manage
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {drivers.length === 0 && (
                        <tr>
                          <td colSpan={7} className="px-4 py-8 text-center font-cormorant text-lg text-brand-black-400">
                            No drivers found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Cities Tab */}
              {activeTab === 'cities' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { name: 'Jacksonville, FL', status: 'live', bookings: bookings.length, drivers: drivers.length },
                    { name: 'Miami, FL', status: 'coming_soon', bookings: 0, drivers: 0 },
                    { name: 'Orlando, FL', status: 'coming_soon', bookings: 0, drivers: 0 },
                    { name: 'Atlanta, GA', status: 'coming_soon', bookings: 0, drivers: 0 },
                    { name: 'Charlotte, NC', status: 'coming_soon', bookings: 0, drivers: 0 },
                  ].map((city) => (
                    <Card key={city.name} padding="md">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="font-cinzel text-base font-medium text-brand-black">{city.name}</h3>
                        <Badge variant={city.status === 'live' ? 'success' : 'warning'} size="sm">
                          {city.status === 'live' ? 'Live' : 'Soon'}
                        </Badge>
                      </div>
                      <div className="flex gap-6">
                        <div>
                          <p className="font-josefin text-[10px] uppercase tracking-wider text-brand-black-400">Bookings</p>
                          <p className="font-cinzel text-xl font-semibold text-brand-black">{city.bookings}</p>
                        </div>
                        <div>
                          <p className="font-josefin text-[10px] uppercase tracking-wider text-brand-black-400">Drivers</p>
                          <p className="font-cinzel text-xl font-semibold text-brand-black">{city.drivers}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboardPage;
