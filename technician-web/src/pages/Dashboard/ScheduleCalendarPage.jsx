import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, UserCheck, Wrench, ChevronLeft, ChevronRight } from 'lucide-react';
import { useBookings } from '../../hooks/useErpQueries';
import { StatusBadge } from '../../components/StatusBadge';
import { formatDate } from '../../utils/formatters';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export const ScheduleCalendarPage = () => {
  const [viewMode, setViewMode] = useState('daily'); // 'daily' | 'weekly'
  const { data: bookingsRes, isLoading } = useBookings();

  const bookings = bookingsRes?.data || [];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Technician Service Job Dispatch Calendar</h1>
          <p className="text-xs text-slate-400">Visual schedule of daily and weekly industrial maintenance & site visits</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('daily')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'daily'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-400 border border-slate-800'
            }`}
          >
            Daily Jobs
          </button>
          <button
            onClick={() => setViewMode('weekly')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'weekly'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-400 border border-slate-800'
            }`}
          >
            Weekly Schedule
          </button>
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner message="Fetching job dispatch schedules..." />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Job Queue */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center space-x-2">
                <CalendarIcon className="w-5 h-5 text-amber-400" />
                <span>Scheduled Jobs List</span>
              </h3>
              <span className="text-xs font-semibold text-slate-400">{bookings.length} Total Bookings</span>
            </div>

            <div className="space-y-3">
              {bookings.map((b) => (
                <div key={b._id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs hover:border-slate-700 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-amber-400 font-bold">{b.bookingNumber}</span>
                      <StatusBadge status={b.status} />
                    </div>
                    <h4 className="font-bold text-white text-sm">{b.service?.title}</h4>
                    <p className="text-slate-300">Customer: {b.customer?.name} ({b.customer?.phone})</p>
                    <p className="text-slate-400">Site Location: {b.address}</p>
                  </div>

                  <div className="text-left md:text-right border-t md:border-t-0 border-slate-800 pt-2 md:pt-0 shrink-0">
                    <span className="text-[10px] text-slate-500 uppercase block">Scheduled Date</span>
                    <span className="font-bold text-sky-400 text-sm">{formatDate(b.preferredDate)}</span>
                    <div className="mt-1 flex items-center md:justify-end space-x-1 text-slate-300">
                      <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                      <span>{b.assignedTechnician?.name || 'Unassigned Tech'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Dispatch Stats */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <h3 className="text-base font-extrabold text-white border-b border-slate-800 pb-3">Dispatch Summary</h3>
              
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between">
                  <span className="text-slate-400">Jobs Needing Tech Assignment:</span>
                  <span className="font-bold text-rose-400">
                    {bookings.filter((b) => !b.assignedTechnician).length}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between">
                  <span className="text-slate-400">Jobs Currently In Progress:</span>
                  <span className="font-bold text-sky-400">
                    {bookings.filter((b) => b.status === 'In Progress').length}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between">
                  <span className="text-slate-400">Completed This Week:</span>
                  <span className="font-bold text-emerald-400">
                    {bookings.filter((b) => b.status === 'Completed').length}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
