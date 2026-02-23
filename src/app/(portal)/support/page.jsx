'use client';

import { useState, useEffect } from 'react';
import { DetailCard } from '@/components/detail/detail-card';
import { StatusBadge } from '@/components/shared/status-badge';
import { formatDate } from '@/lib/utils/format';
import { FilterSelect } from '@/components/data/filters-bar';
import { Phone, Mail, MessageSquare, ChevronDown, ChevronUp, Plus, Ticket, X, Send, ExternalLink, Link2 } from 'lucide-react';
import { toast } from 'sonner';

const TICKET_TYPE_OPTIONS = [
  { value: 'Product Issue', label: 'Product Issue' },
  { value: 'Order Issue', label: 'Order Issue' },
  { value: 'Technical Support', label: 'Technical Support' },
  { value: 'General Inquiry', label: 'General Inquiry' },
];

const STATUS_FILTER_OPTIONS = [
  { value: 'Open', label: 'Open' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Awaiting Parts', label: 'Awaiting Parts' },
  { value: 'Scheduled', label: 'Scheduled' },
  { value: 'Completed', label: 'Completed' },
];

export default function SupportPage() {
  const [serviceRequests, setServiceRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isLoadingTickets, setIsLoadingTickets] = useState(true);

  // Chat widget state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { from: 'system', text: 'Connected to Solventum Support. How can we help you today?' },
  ]);
  const [chatInput, setChatInput] = useState('');

  // Create ticket form state
  const [ticketType, setTicketType] = useState('');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');
  const [ticketRelated, setTicketRelated] = useState('');
  const [ticketRma, setTicketRma] = useState('');

  // Load service requests
  useEffect(() => {
    import('@/lib/mock-data/service-requests').then(({ serviceRequests: data }) => {
      setServiceRequests(data);
      setIsLoadingTickets(false);
    });
  }, []);

  const filteredRequests = statusFilter
    ? serviceRequests.filter((sr) => sr.status === statusFilter)
    : serviceRequests;

  const handleCreateTicket = () => {
    if (!ticketType || !ticketSubject || !ticketDescription) {
      toast.error('Please fill in all required fields');
      return;
    }
    toast.success('Support ticket created successfully. You will receive a confirmation email with your ticket number.');
    setTicketType('');
    setTicketSubject('');
    setTicketDescription('');
    setTicketRelated('');
    setTicketRma('');
    setShowCreateForm(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>Support</h1>
      <p className="text-sm text-[#3c3e3f]">Get help with your Solventum Ortho Portal account</p>

      {/* Contact cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <DetailCard>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#bffde3]">
              <Phone className="h-6 w-6 text-[#05dd4d]" />
            </div>
            <h3 className="text-base font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>Phone Support</h3>
            <p className="mt-2 text-sm text-[#3c3e3f]">Mon-Fri, 8AM-6PM EST</p>
            <p className="mt-1 text-lg font-bold text-[#0a7b6b]" style={{ fontFamily: 'var(--font-heading)' }}>1-800-253-3210</p>
          </div>
        </DetailCard>

        <DetailCard>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#bffde3]">
              <Mail className="h-6 w-6 text-[#0a7b6b]" />
            </div>
            <h3 className="text-base font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>Email Support</h3>
            <p className="mt-2 text-sm text-[#3c3e3f]">Response within 24 hours</p>
            <p className="mt-1 text-sm font-bold text-[#0a7b6b]" style={{ fontFamily: 'var(--font-heading)' }}>ortho-support@solventum.com</p>
          </div>
        </DetailCard>

        <DetailCard>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#bffde3]">
              <MessageSquare className="h-6 w-6 text-[#0a7b6b]" />
            </div>
            <h3 className="text-base font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>Live Chat</h3>
            <p className="mt-2 text-sm text-[#3c3e3f]">Available during business hours</p>
            <button
              onClick={() => setChatOpen(true)}
              className="mt-2 rounded-md bg-[#0a7b6b] px-4 py-2 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#087a69]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Start Live Chat
            </button>
            <p className="mt-1.5 flex items-center justify-center gap-1 text-[10px] text-[#0a7b6b]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#05dd4d]" /> Connected to Salesforce
            </p>
          </div>
        </DetailCard>
      </div>

      {/* Sample request link */}
      <div className="rounded-lg border border-[#bffde3] bg-[#bffde3]/20 p-4">
        <p className="text-sm text-[#01332b]">
          Need product samples?{' '}
          <a href="/samples" className="font-bold text-[#0a7b6b] hover:underline">
            Request Samples &rarr;
          </a>
        </p>
      </div>

      {/* Service Requests / Tickets Table */}
      <DetailCard title="Service Requests">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FilterSelect
              label="All Statuses"
              value={statusFilter}
              onChange={setStatusFilter}
              options={STATUS_FILTER_OPTIONS}
            />
            <span className="text-xs text-[#3c3e3f]">{filteredRequests.length} ticket{filteredRequests.length !== 1 ? 's' : ''}</span>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center gap-1.5 rounded-md bg-[#05dd4d] px-4 py-2 text-sm font-bold uppercase tracking-wider text-[#01332b] transition-colors hover:bg-[#04c443]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {showCreateForm ? <ChevronUp className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            Create Ticket
          </button>
        </div>

        {/* Create Ticket Form (expandable) */}
        {showCreateForm && (
          <div className="mb-6 rounded-lg border border-[#e7e7e7] bg-[#F5F5F5] p-4">
            <h4 className="mb-3 text-sm font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>New Support Ticket</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={ticketType}
                  onChange={(e) => setTicketType(e.target.value)}
                  className="h-10 w-full rounded-md border border-[#e7e7e7] bg-white px-3 text-sm text-[#01332b] focus:border-[#0a7b6b] focus:outline-none focus:ring-1 focus:ring-[#0a7b6b]"
                >
                  <option value="">Select type...</option>
                  {TICKET_TYPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>
                  Related Order/Product (Optional)
                </label>
                <input
                  type="text"
                  value={ticketRelated}
                  onChange={(e) => setTicketRelated(e.target.value)}
                  placeholder="e.g., ORD-2026-0001 or PRD-001"
                  className="h-10 w-full rounded-md border border-[#e7e7e7] bg-white px-3 text-sm text-[#01332b] placeholder:text-[#e7e7e7] focus:border-[#0a7b6b] focus:outline-none focus:ring-1 focus:ring-[#0a7b6b]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>
                  Link to RMA (Optional)
                </label>
                <select
                  value={ticketRma}
                  onChange={(e) => setTicketRma(e.target.value)}
                  className="h-10 w-full rounded-md border border-[#e7e7e7] bg-white px-3 text-sm text-[#01332b] focus:border-[#0a7b6b] focus:outline-none focus:ring-1 focus:ring-[#0a7b6b]"
                >
                  <option value="">None</option>
                  <option value="RMA-2025-0001">RMA-2025-0001 — Defective Brackets</option>
                  <option value="RMA-2024-0002">RMA-2024-0002 — Wrong Archwires</option>
                  <option value="RMA-2025-0003">RMA-2025-0003 — Expired Product</option>
                  <option value="RMA-2024-0004">RMA-2024-0004 — Damaged in Transit</option>
                  <option value="RMA-2025-0006">RMA-2025-0006 — Defective Brackets</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="Brief summary of your issue"
                  className="h-10 w-full rounded-md border border-[#e7e7e7] bg-white px-3 text-sm text-[#01332b] placeholder:text-[#e7e7e7] focus:border-[#0a7b6b] focus:outline-none focus:ring-1 focus:ring-[#0a7b6b]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={ticketDescription}
                  onChange={(e) => setTicketDescription(e.target.value)}
                  placeholder="Provide details about your issue..."
                  rows={4}
                  className="w-full rounded-md border border-[#e7e7e7] bg-white px-3 py-2 text-sm text-[#01332b] placeholder:text-[#e7e7e7] focus:border-[#0a7b6b] focus:outline-none focus:ring-1 focus:ring-[#0a7b6b]"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowCreateForm(false)}
                className="rounded-md border border-[#e7e7e7] px-4 py-2 text-sm text-[#3c3e3f] transition-colors hover:bg-white"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTicket}
                className="rounded-md bg-[#0a7b6b] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#087a69]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Submit Ticket
              </button>
            </div>
          </div>
        )}

        {/* Tickets table */}
        {isLoadingTickets ? (
          <div className="py-8 text-center text-sm text-[#3c3e3f]">Loading tickets...</div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-[#e7e7e7]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e7e7e7] bg-[#F5F5F5]">
                  {['Ticket ID', 'SF Case', 'Subject', 'Status', 'Priority', 'Created Date'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((sr) => (
                  <tr key={sr.id} className="border-b border-[#F5F5F5] last:border-b-0 hover:bg-[#FAFAFA]">
                    <td className="px-4 py-3 font-mono text-xs font-bold text-[#0a7b6b]">{sr.id}</td>
                    <td className="px-4 py-3">
                      {sr.sfCaseId ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#E3F2FD] px-2 py-0.5 text-[10px] font-bold text-[#1565C0]" style={{ fontFamily: 'var(--font-heading)' }}>
                          <Link2 className="h-3 w-3" />
                          {sr.sfCaseId}
                        </span>
                      ) : (
                        <span className="text-xs text-[#e7e7e7]">&mdash;</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>{sr.subject}</td>
                    <td className="px-4 py-3"><StatusBadge status={sr.status} /></td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        sr.priority === 'Critical' ? 'bg-[#FFEBEE] text-[#C62828]' :
                        sr.priority === 'High' ? 'bg-[#FFF3E0] text-[#E65100]' :
                        'bg-[#F5F5F5] text-[#3c3e3f]'
                      }`} style={{ fontFamily: 'var(--font-heading)' }}>
                        {sr.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#3c3e3f]">{formatDate(sr.requestedDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredRequests.length === 0 && (
              <div className="py-8 text-center text-sm text-[#3c3e3f]">No tickets found{statusFilter ? ' with this status' : ''}.</div>
            )}
          </div>
        )}
      </DetailCard>

      {/* FAQ */}
      <DetailCard title="Frequently Asked Questions">
        <div className="space-y-4">
          {[
            { q: 'How do I request product samples?', a: 'Navigate to the Product Catalog, find the product you are interested in, and click the "Request Sample" button on the product detail page. Only products marked with "Sample Available" are eligible. You will receive a confirmation email once your request is processed.' },
            { q: 'How do I submit a Clarity aligner case?', a: 'Go to the Clarity Aligners section in the product catalog and select the appropriate aligner kit. Follow the case submission workflow, which includes uploading intraoral scans, photos, and treatment preferences. Your case will be reviewed by the Clarity team within 2-3 business days.' },
            { q: 'How do I track my shipment?', a: 'Navigate to the Orders section to see all your orders with their current status. Once an order ships, you will see tracking numbers and carrier links. You can also enable SMS or email notifications for real-time shipment updates in your account preferences.' },
            { q: 'How do I request a return?', a: 'Go to the Orders section, find the order containing the product you wish to return, and click "Request Return." Fill out the return reason and any additional details. Our team will review your request and provide an RMA number within 1-2 business days.' },
            { q: 'How do I view my contract pricing?', a: 'Visit the Price List page to see your negotiated contract pricing alongside standard list prices. Your contract tier (Bronze, Silver, Gold, or Platinum) determines your discount level. If you believe your pricing is incorrect, contact your sales representative or reach out to support.' },
          ].map((faq, i) => (
            <div key={i} className="rounded-md border border-[#F5F5F5] p-4">
              <h4 className="text-sm font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>{faq.q}</h4>
              <p className="mt-1 text-sm text-[#3c3e3f]">{faq.a}</p>
            </div>
          ))}
        </div>
      </DetailCard>

      {/* Mock chat widget */}
      {chatOpen && (
        <div className="fixed bottom-4 right-4 z-50 flex h-96 w-80 flex-col rounded-lg border border-[#e7e7e7] bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between rounded-t-lg bg-[#01332b] px-4 py-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-[#05dd4d]" />
              <span className="text-sm font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>Live Support</span>
            </div>
            <button onClick={() => setChatOpen(false)} className="text-white/60 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
          {/* Salesforce indicator */}
          <div className="flex items-center gap-1.5 border-b border-[#e7e7e7] bg-[#F5F5F5] px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#05dd4d]" />
            <span className="text-[10px] text-[#3c3e3f]">Synced with Salesforce Service Cloud</span>
          </div>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                  msg.from === 'user'
                    ? 'bg-[#0a7b6b] text-white'
                    : 'bg-[#F5F5F5] text-[#01332b]'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          {/* Input */}
          <div className="border-t border-[#e7e7e7] p-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && chatInput.trim()) {
                    setChatMessages(prev => [...prev, { from: 'user', text: chatInput }]);
                    const input = chatInput;
                    setChatInput('');
                    setTimeout(() => {
                      setChatMessages(prev => [...prev, { from: 'agent', text: 'Thank you for your message. A support agent will be with you shortly. Your case has been logged in Salesforce.' }]);
                    }, 1500);
                  }
                }}
                placeholder="Type a message..."
                className="flex-1 rounded-md border border-[#e7e7e7] px-3 py-2 text-sm focus:border-[#0a7b6b] focus:outline-none focus:ring-1 focus:ring-[#0a7b6b]"
              />
              <button
                onClick={() => {
                  if (chatInput.trim()) {
                    setChatMessages(prev => [...prev, { from: 'user', text: chatInput }]);
                    setChatInput('');
                    setTimeout(() => {
                      setChatMessages(prev => [...prev, { from: 'agent', text: 'Thank you for your message. A support agent will be with you shortly. Your case has been logged in Salesforce.' }]);
                    }, 1500);
                  }
                }}
                className="rounded-md bg-[#0a7b6b] px-3 py-2 text-white hover:bg-[#087a69]"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
