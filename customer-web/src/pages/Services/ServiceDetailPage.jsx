import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ChevronLeft, Clock, Wrench, Phone, Zap, Receipt, CheckCircle2, MapPin } from 'lucide-react';
import { getServiceByIdApi } from '../../api/serviceApi';
import { formatCurrency } from '../../utils/formatters';
import { Seo } from '../../components/Seo';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export const ServiceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: res, isLoading, isError } = useQuery({
    queryKey: ['service', id],
    queryFn: () => getServiceByIdApi(id),
    enabled: !!id
  });

  const service = res?.data;

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-white dark:bg-slate-950">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !service) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 bg-white dark:bg-slate-950 px-4 text-center">
        <Wrench className="w-14 h-14 text-slate-300 dark:text-slate-700" />
        <h1 className="text-xl font-black text-[#0F172A] dark:text-white">Service not found</h1>
        <Link to="/services" className="px-6 py-3 rounded-2xl bg-[#F97316] text-white font-black text-xs hover:bg-[#E55A00] transition-all">
          Back to Services
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-[#0F172A] dark:text-slate-100 transition-colors duration-300">
      <Seo
        title={`${service.title} - from ${formatCurrency(service.estimatedPrice)} | Uday Electrical Works`}
        description={service.description?.slice(0, 160)}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#475569] dark:text-slate-400 hover:text-[#F97316] transition-colors mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative rounded-3xl overflow-hidden border border-[#E2E8F0] dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-900 shadow-card h-[380px]"
          >
            {service.imageUrl ? (
              <img src={service.imageUrl} alt={service.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Wrench className="w-24 h-24 text-slate-300 dark:text-slate-700" />
              </div>
            )}
            <span className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-slate-900/90 text-white font-black text-[10px] uppercase shadow-md">
              {service.category}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            <div>
              <span className="text-xs font-bold text-[#0066FF] uppercase">{service.category}</span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] dark:text-white mt-1 leading-tight">
                {service.title}
              </h1>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Starting Fee</span>
                <span className="text-2xl font-black text-[#F97316]">{formatCurrency(service.estimatedPrice)}</span>
                <p className="text-[10px] text-slate-400">Final price confirmed before work starts</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-[#0066FF]" />
                  <span>Duration</span>
                </span>
                <span className="text-2xl font-black text-[#0F172A] dark:text-white">{service.estimatedDuration}</span>
                <p className="text-[10px] text-slate-400">Typical time at your home</p>
              </div>
            </div>

            <p className="text-sm text-[#475569] dark:text-slate-300 leading-relaxed">{service.description}</p>

            <div className="space-y-2.5">
              {[
                { icon: CheckCircle2, text: 'Booking status tracked online in your account' },
                { icon: Receipt, text: 'Digital GST invoice after the job' },
                { icon: Wrench, text: 'Done by our own wiremen: Prabhat, Chandan, Devnath, Appu & team' },
                { icon: MapPin, text: 'All of Jamshedpur, 13 areas served' }
              ].map(({ icon: Icon, text }, idx) => (
                <div key={idx} className="flex items-center space-x-2.5 text-xs text-[#475569] dark:text-slate-300">
                  <span className="p-1.5 rounded-lg bg-[#00C853]/10 text-[#00C853] shrink-0"><Icon className="w-3.5 h-3.5" /></span>
                  <span className="font-semibold">{text}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                to={`/services/${service._id}/book`}
                className="px-6 py-3.5 rounded-2xl bg-[#F97316] hover:bg-[#E55A00] text-white font-black text-xs flex items-center space-x-2 transition-all shadow-md hover:shadow-glow-orange"
              >
                <Zap className="w-4 h-4" />
                <span>Book This Service</span>
              </Link>
              <a
                href="tel:7903789402"
                className="px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 text-[#0F172A] dark:text-white font-black text-xs flex items-center space-x-2 hover:border-[#F97316] transition-all"
              >
                <Phone className="w-4 h-4 text-[#F97316]" />
                <span>Call Shop</span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
