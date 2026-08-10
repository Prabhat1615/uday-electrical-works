import React, { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle2, Building, CreditCard, Mail } from 'lucide-react';
import { useCompanySettings, useUpdateCompanySettings } from '../../hooks/useErpQueries';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export const CompanySettingsPage = () => {
  const { data: res, isLoading } = useCompanySettings();
  const updateSettingsMutation = useUpdateCompanySettings();

  const [companyName, setCompanyName] = useState('');
  const [tagline, setTagline] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [invoiceFooterNotes, setInvoiceFooterNotes] = useState('');
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(true);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (res?.data) {
      const s = res.data;
      setCompanyName(s.companyName || '');
      setTagline(s.tagline || '');
      setPhone(s.phone || '');
      setEmail(s.email || '');
      setAddress(s.address || '');
      setGstNumber(s.gstNumber || '');
      setBankName(s.bankName || '');
      setAccountNumber(s.accountNumber || '');
      setIfscCode(s.ifscCode || '');
      setInvoiceFooterNotes(s.invoiceFooterNotes || '');
      setEmailNotificationsEnabled(s.emailNotificationsEnabled !== false);
    }
  }, [res]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    try {
      await updateSettingsMutation.mutateAsync({
        companyName,
        tagline,
        phone,
        email,
        address,
        gstNumber,
        bankName,
        accountNumber,
        ifscCode,
        invoiceFooterNotes,
        emailNotificationsEnabled
      });
      setSuccess('Company profile & invoice settings updated successfully!');
    } catch (err) {
      alert(err.message || 'Failed to update settings');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-extrabold text-white">Company Profile & ERP Settings</h1>
        <p className="text-xs text-slate-400">Configure company GSTIN, bank details for tax invoices, address & email settings</p>
      </div>

      {isLoading ? (
        <LoadingSpinner message="Loading company settings..." />
      ) : (
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl text-xs">
          
          {success && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* Company Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-white border-b border-slate-800 pb-2 uppercase tracking-wider text-amber-400">
              1. Business Organization
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-bold uppercase mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-amber-500/50 font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-bold uppercase mb-1">GSTIN Number *</label>
                <input
                  type="text"
                  required
                  value={gstNumber}
                  onChange={(e) => setGstNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sky-400 font-mono text-sm focus:outline-none focus:border-amber-500/50 font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-bold uppercase mb-1">Tagline / Business Header</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-bold uppercase mb-1">Official Contact Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-amber-500/50"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-bold uppercase mb-1">Official Contact Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-amber-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-bold uppercase mb-1">Registered Address</label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-amber-500/50"
              />
            </div>
          </div>

          {/* Banking Info for Invoices */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-sm font-extrabold text-white border-b border-slate-800 pb-2 uppercase tracking-wider text-amber-400">
              2. Banking & Tax Invoice Notes
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-300 font-bold uppercase mb-1">Bank Name</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-amber-500/50"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-bold uppercase mb-1">Account Number</label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-amber-500/50 font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-bold uppercase mb-1">IFSC Code</label>
                <input
                  type="text"
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-amber-500/50 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-bold uppercase mb-1">Tax Invoice Footer Terms & Warranty Notes</label>
              <textarea
                rows={2}
                value={invoiceFooterNotes}
                onChange={(e) => setInvoiceFooterNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-amber-500/50"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm transition-all shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>Save Company Settings</span>
            </button>
          </div>

        </form>
      )}

    </div>
  );
};
