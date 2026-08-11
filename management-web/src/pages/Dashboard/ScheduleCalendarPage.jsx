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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Technician Service Job Dispatch Calendar</h1>
          <p className="text-xs text-slate-500">Visual schedule of daily and weekly industrial maintenance & site visits</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('daily')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'daily'
                ? 'bg-amber-500 text-white shadow-md'
                : 'bg-white text-slate-500 border border-slate-200'
            }`}
          >
            Daily Jobs
          </button>
          <button
            onClick={() => setViewMode('weekly')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'weekly'
                ? 'bg-amber-500 text-white shadow-md'
                : 'bg-white text-slate-500 border border-slate-200'
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
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-card">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
                <CalendarIcon className="w-5 h-5 text-amber-600" />
                <span>Scheduled Jobs List</span>
              </h3>
              <span className="text-xs font-semibold text-slate-500">{bookings.length} Total Bookings</span>
            </div>

            <div className="space-y-3">
              {bookings.map((b) => (
                <div key={b._id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs hover:border-slate-300 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-amber-600 font-bold">{b.bookingNumber}</span>
                      <StatusBadge status={b.status} />
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">{b.service?.title}</h4>
                    <p className="text-slate-600">Customer: {b.customer?.name} ({b.customer?.phone})</p>
                    <p className="text-slate-500">Site Location: {b.address}</p>
                  </div>

                  <div className="text-left md:text-right border-t md:border-t-0 border-slate-200 pt-2 md:pt-0 shrink-0">
                    <span className="text-[10px] text-slate-500 uppercase block">Scheduled Date</span>
                    <span className="font-bold text-sky-600 text-sm">{formatDate(b.preferredDate)}</span>
                    <div className="mt-1 flex items-center md:justify-end space-x-1 text-slate-600">
                      <UserCheck className="w-3.5 h-3.5 text-amber-600" />
                      <span>{b.assignedTechnician?.name || 'Unassigned Tech'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Dispatch Stats */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-card">
              <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-200 pb-3">Dispatch Summary</h3>
              
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between">
                  <span className="text-slate-500">Jobs Needing Tech Assignment:</span>
                  <span className="font-bold text-rose-600">
                    {bookings.filter((b) => !b.assignedTechnician).length}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between">
                  <span className="text-slate-500">Jobs Currently In Progress:</span>
                  <span className="font-bold text-sky-600">
                    {bookings.filter((b) => b.status === 'In Progress').length}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between">
                  <span className="text-slate-500">Completed This Week:</span>
                  <span className="font-bold text-emerald-600">
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
