/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Building2,
  Search,
  MapPin,
  Phone,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  X,
  Navigation,
  FileCheck,
  ShieldAlert,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { api } from '../services/api.js';
import { Appointment, Clinic } from '../types/index.js';

export const AppointmentsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'appointments' | 'clinics'>('appointments');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal detail
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      setLoading(true);
      try {
        const [apts, clns] = await Promise.all([
          api.getAppointments({ search: searchQuery, status: statusFilter }),
          api.getClinics({ search: searchQuery }),
        ]);
        if (isMounted) {
          setAppointments(apts);
          setClinics(clns);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to load appointments/clinics:', err);
        if (isMounted) setLoading(false);
      }
    }
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [searchQuery, statusFilter]);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Confirmed</span>
          </span>
        );
      case 'completed':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            Completed
          </span>
        );
      case 'canceled':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            Canceled
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-50 text-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-150">
      {/* Top Banner Notice */}
      <div className="bg-amber-50/90 border border-amber-200/80 p-4 rounded-2xl text-xs text-amber-900 flex items-start gap-3 shadow-2xs">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="font-bold">Demonstration Records Notice:</strong> All appointments, physicians, clinic facilities, addresses, and phone numbers shown on this page are fictional demonstration records. In this prototype, appointments cannot be altered or rescheduled without connection to an electronic health record system.
        </div>
      </div>

      {/* Tabs & Search Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Tab switcher */}
        <div className="flex bg-slate-100 p-1 rounded-2xl w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'appointments'
                ? 'bg-white text-teal-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4 text-teal-600" />
            <span>My Appointments ({appointments.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('clinics')}
            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'clinics'
                ? 'bg-white text-teal-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4 text-teal-600" />
            <span>Clinic Directory ({clinics.length})</span>
          </button>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1 max-w-lg">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeTab === 'appointments'
                  ? 'Search by provider, type, clinic...'
                  : 'Search clinics, departments, services...'
              }
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
            />
          </div>

          {activeTab === 'appointments' && (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter appointments by status"
              className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
            </select>
          )}
        </div>
      </div>

      {/* APPOINTMENTS TAB */}
      {activeTab === 'appointments' && (
        <div className="space-y-4">
          {loading ? (
            <div className="p-12 text-center text-xs text-slate-400">Loading appointment records...</div>
          ) : appointments.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="font-bold text-slate-700 text-sm">No Appointments Found</p>
              <p className="text-xs text-slate-500">
                Try adjusting your search criteria or filter options.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {appointments.map((apt) => {
                const dateObj = new Date(apt.dateTime);
                return (
                  <div
                    key={apt.id}
                    onClick={() => setSelectedAppointment(apt)}
                    className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-teal-300 transition-all cursor-pointer flex flex-col justify-between text-left group"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="p-2.5 bg-teal-50 text-teal-700 rounded-xl group-hover:scale-105 transition-transform">
                          <Calendar className="w-5 h-5" />
                        </div>
                        {getStatusBadge(apt.status)}
                      </div>

                      <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                        {apt.appointmentType}
                      </h3>
                      <p className="text-xs font-semibold text-slate-600 mt-0.5 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{apt.providerName}</span>
                      </p>

                      <div className="mt-4 space-y-2 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-2 font-medium text-slate-800">
                          <Clock className="w-4 h-4 text-teal-600 shrink-0" />
                          <span>
                            {dateObj.toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}{' '}
                            at{' '}
                            {dateObj.toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Building2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                          <span className="truncate">{apt.clinicName}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                          <span className="truncate">{apt.clinicAddress}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                          <span>{apt.contactPhone}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-teal-700">
                      <span>View Preparation & Details</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* CLINIC DIRECTORY TAB */}
      {activeTab === 'clinics' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clinics.map((clinic) => (
              <div
                key={clinic.id}
                onClick={() => setSelectedClinic(clinic)}
                className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between text-left group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="p-2.5 bg-blue-50 text-blue-700 rounded-xl group-hover:scale-105 transition-transform">
                      <Building2 className="w-5 h-5" />
                    </div>
                    {clinic.telehealthAvailable && (
                      <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                        Telehealth Offered
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                    {clinic.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {clinic.department}
                  </p>

                  <div className="mt-4 space-y-2 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <span>
                        {clinic.address}, {clinic.city}, {clinic.state} {clinic.zip}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{clinic.phone}</span>
                    </div>
                  </div>

                  {/* General services tag preview */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {clinic.generalServices.slice(0, 3).map((srv, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700"
                      >
                        {srv}
                      </span>
                    ))}
                    {clinic.generalServices.length > 3 && (
                      <span className="text-[11px] px-2 py-0.5 rounded-lg bg-slate-100 text-slate-500">
                        +{clinic.generalServices.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-700">
                  <span>View Hours & Full Services</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Appointment Detail Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                  Appointment Details
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  {selectedAppointment.appointmentType}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAppointment(null)}
                aria-label="Close appointment details"
                className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Status:</span>
                  {getStatusBadge(selectedAppointment.status)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Clinician:</span>
                  <span className="font-bold text-slate-900">{selectedAppointment.providerName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Department:</span>
                  <span className="text-slate-700">{selectedAppointment.providerDepartment}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Date & Time:</span>
                  <span className="font-bold text-teal-800">
                    {new Date(selectedAppointment.dateTime).toLocaleString('en-US', {
                      dateStyle: 'full',
                      timeStyle: 'short',
                    })}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
                  Clinic Location & Contact
                </h4>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs text-slate-700">
                  <p className="font-bold text-slate-900">{selectedAppointment.clinicName}</p>
                  <p>{selectedAppointment.clinicAddress}</p>
                  <p className="text-teal-700 font-semibold">Phone: {selectedAppointment.contactPhone}</p>
                </div>
              </div>

              {selectedAppointment.preparationInstructions && (
                <div>
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-teal-600" />
                    <span>Preparation Checklist Before Your Visit</span>
                  </h4>
                  <div className="space-y-2">
                    {selectedAppointment.preparationInstructions.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-2.5 rounded-xl bg-teal-50/60 border border-teal-100 text-xs text-teal-950">
                        <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedAppointment.notes && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                  <span className="font-bold text-slate-800">Clinician Notes: </span>
                  {selectedAppointment.notes}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedAppointment(null)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clinic Detail Modal */}
      {selectedClinic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                  Clinic Information
                </span>
                <h3 className="text-lg font-bold text-slate-900">{selectedClinic.name}</h3>
                <p className="text-xs text-slate-500">{selectedClinic.department}</p>
              </div>
              <button
                onClick={() => setSelectedClinic(null)}
                aria-label="Close clinic details"
                className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>
                    {selectedClinic.address}, {selectedClinic.city}, {selectedClinic.state} {selectedClinic.zip}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{selectedClinic.phone}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
                  Operating Hours
                </h4>
                <div className="divide-y divide-slate-100 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                  {Object.entries(selectedClinic.hours).map(([days, timeStr]) => (
                    <div key={days} className="py-1.5 flex justify-between text-xs">
                      <span className="font-medium text-slate-600">{days}</span>
                      <span className="font-bold text-slate-900">{timeStr}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
                  General Services Provided
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedClinic.generalServices.map((srv, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-100 text-xs text-blue-950 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{srv}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2 text-xs text-slate-600">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Wheelchair Accessible</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Dedicated Patient Parking</span>
                </span>
                {selectedClinic.telehealthAvailable && (
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Virtual Telehealth Visits</span>
                  </span>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedClinic(null)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl"
              >
                Close Clinic Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
