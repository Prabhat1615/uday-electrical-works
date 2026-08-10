import React, { useState } from 'react';
import { LifeBuoy, Plus, MessageSquare, CheckCircle2, Clock, Send, ShieldAlert } from 'lucide-react';
import { useTickets, useCreateTicket, useReplyTicket } from '../../hooks/useErpQueries';
import { useAuth } from '../../hooks/useAuth';
import { StatusBadge } from '../../components/StatusBadge';
import { formatDate } from '../../utils/formatters';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Modal } from '../../components/Modal';

export const SupportTicketsPage = () => {
  const { user } = useAuth();
  const [activeTicket, setActiveTicket] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Form State
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Electrical Repair');
  const [priority, setPriority] = useState('Medium');
  const [description, setDescription] = useState('');

  // Reply State
  const [replyMsg, setReplyMsg] = useState('');
  const [updateStatus, setUpdateStatus] = useState('');

  const { data: res, isLoading } = useTickets();
  const createTicketMutation = useCreateTicket();
  const replyTicketMutation = useReplyTicket();

  const tickets = res?.data || [];

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTicketMutation.mutateAsync({
        subject,
        category,
        priority,
        description
      });
      setIsCreateOpen(false);
      setSubject('');
      setDescription('');
    } catch (err) {
      alert(err.message || 'Failed to submit ticket');
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!activeTicket) return;

    try {
      await replyTicketMutation.mutateAsync({
        id: activeTicket._id,
        data: {
          message: replyMsg,
          status: updateStatus || activeTicket.status
        }
      });
      setReplyMsg('');
      setActiveTicket(null);
    } catch (err) {
      alert(err.message || 'Failed to add reply');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Customer Helpdesk & Support Tickets</h1>
          <p className="text-xs text-slate-400">Submit technical support inquiries, rewinding warranty claims & invoice queries</p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>New Support Ticket</span>
        </button>
      </div>

      {/* Tickets List */}
      {isLoading ? (
        <LoadingSpinner message="Fetching support tickets..." />
      ) : tickets.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 rounded-2xl border border-slate-800 text-slate-400 space-y-2">
          <LifeBuoy className="w-10 h-10 text-amber-500/50 mx-auto" />
          <h3 className="text-base font-bold text-white">No Support Tickets Found</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {tickets.map((t) => (
            <div key={t._id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl hover:border-amber-500/40 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-amber-400 font-bold text-xs">{t.ticketNumber}</span>
                  <StatusBadge status={t.status} />
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                    {t.priority} Priority
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mt-1">{t.subject}</h3>
                <p className="text-xs text-slate-400">Customer: {t.customer?.name} ({t.customer?.email})</p>
                <p className="text-xs text-slate-300 line-clamp-1">{t.description}</p>
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                <span className="text-xs text-slate-500">{t.replies?.length || 0} Replies</span>
                <button
                  onClick={() => {
                    setActiveTicket(t);
                    setUpdateStatus(t.status);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
                >
                  View & Reply Thread
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Ticket Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Submit Support Ticket">
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-bold uppercase mb-1">Subject / Technical Issue *</label>
            <input
              type="text"
              required
              placeholder="e.g. Motor tripping on full load after rewinding"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-amber-500/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-bold uppercase mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-amber-500/50"
              >
                <option value="Electrical Repair">Electrical Repair</option>
                <option value="Motor Rewinding">Motor Rewinding</option>
                <option value="Transformer Issue">Transformer Issue</option>
                <option value="Billing & Invoice">Billing & Invoice</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-bold uppercase mb-1">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-amber-500/50 font-semibold"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent (Plant Down)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-bold uppercase mb-1">Detailed Description *</label>
            <textarea
              rows={3}
              required
              placeholder="Explain fault symptoms, trip codes, or invoice questions..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-amber-500/50"
            />
          </div>

          <div className="pt-2 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold shadow-md"
            >
              Submit Ticket
            </button>
          </div>
        </form>
      </Modal>

      {/* Ticket Thread & Reply Modal */}
      <Modal isOpen={!!activeTicket} onClose={() => setActiveTicket(null)} title={`Ticket Thread: ${activeTicket?.ticketNumber}`}>
        {activeTicket && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="font-bold text-amber-400 uppercase text-[10px]">{activeTicket.category}</span>
              <h3 className="text-base font-bold text-white">{activeTicket.subject}</h3>
              <p className="text-slate-300 mt-1">{activeTicket.description}</p>
            </div>

            {/* Replies List */}
            <div className="space-y-3 max-h-60 overflow-y-auto p-1">
              <h4 className="font-bold text-slate-400 uppercase text-[10px]">Conversation History</h4>
              {activeTicket.replies?.length === 0 ? (
                <p className="text-slate-500 italic">No replies yet.</p>
              ) : (
                activeTicket.replies.map((r, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="font-bold text-sky-400">{r.sender?.name} ({r.sender?.role})</span>
                      <span className="text-slate-500">{formatDate(r.createdAt)}</span>
                    </div>
                    <p className="text-slate-200">{r.message}</p>
                  </div>
                ))
              )}
            </div>

            {/* Reply Form */}
            <form onSubmit={handleReplySubmit} className="space-y-3 pt-3 border-t border-slate-800">
              <div>
                <label className="block text-slate-300 font-bold uppercase mb-1">Add Reply Message</label>
                <textarea
                  rows={2}
                  placeholder="Type your response here..."
                  value={replyMsg}
                  onChange={(e) => setReplyMsg(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold uppercase mb-1">Update Status</label>
                <select
                  value={updateStatus}
                  onChange={(e) => setUpdateStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-amber-500/50 font-bold"
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTicket(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Close Window
                </button>
                <button
                  type="submit"
                  className="flex items-center space-x-2 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold shadow-md"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Reply</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </Modal>

    </div>
  );
};
