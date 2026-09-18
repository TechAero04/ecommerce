import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { MOCK_FAQS } from '../data/mockData';
import { 
  HelpCircle, 
  MessageSquare, 
  PhoneCall, 
  Mail, 
  ChevronDown, 
  ChevronUp, 
  Send, 
  Search, 
  CheckCircle2, 
  Sparkles,
  ChevronRight
} from 'lucide-react';

export const SupportPage = () => {
  const { navigateTo, showToast } = useShop();

  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [faqSearch, setFaqSearch] = useState('');
  const [ticketForm, setTicketForm] = useState({ name: '', email: '', subject: '', message: '' });

  const filteredFaqs = MOCK_FAQS.filter(f => 
    f.question.toLowerCase().includes(faqSearch.toLowerCase()) || 
    f.answer.toLowerCase().includes(faqSearch.toLowerCase())
  );

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    showToast('Support ticket submitted successfully! Ticket ID #TKT-89420', 'success');
    setTicketForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '80vh', padding: '2.5rem 0 5rem' }}>
      <div className="container">
        
        {/* Breadcrumbs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
          <span style={{ cursor: 'pointer' }} onClick={() => navigateTo('home')}>Home</span>
          <ChevronRight size={14} />
          <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>Help & Customer Support</span>
        </div>

        {/* Hero Support Banner */}
        <div style={{
          background: 'var(--gradient-hero)',
          color: 'white',
          padding: '3rem 2rem',
          borderRadius: 'var(--radius-lg)',
          textAlign: 'center',
          marginBottom: '3rem',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            How Can We Help You Today?
          </h1>
          <p style={{ color: 'var(--text-light)', fontSize: '1rem', maxWidth: '540px', margin: '0 auto 1.5rem' }}>
            Search our knowledge base or get in touch with our 24/7 dedicated customer care team.
          </p>

          <div style={{ position: 'relative', maxWidth: '500px', margin: '0 auto' }}>
            <input
              type="text"
              placeholder="Search help topics, returns, shipping, coupons..."
              value={faqSearch}
              onChange={(e) => setFaqSearch(e.target.value)}
              className="input-field"
              style={{
                borderRadius: 'var(--radius-full)',
                paddingLeft: '2.8rem',
                fontSize: '0.95rem',
                background: 'white'
              }}
            />
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          </div>
        </div>

        {/* Quick Contact Cards */}
        <div className="grid-cols-3" style={{ marginBottom: '3rem' }}>
          
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
            <div style={{ background: 'var(--color-primary-light)', width: '50px', height: '50px', borderRadius: '50%', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <PhoneCall size={24} />
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.3rem' }}>Toll-Free Helpline</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Available 24/7 in English & Hindi</p>
            <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-primary)' }}>1800-VELMORA-CARE</span>
          </div>

          <div style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
            <div style={{ background: '#D1FAE5', width: '50px', height: '50px', borderRadius: '50%', color: 'var(--color-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <Mail size={24} />
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.3rem' }}>Email Support</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Average response time: 2 hours</p>
            <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-emerald)' }}>support@velmora.com</span>
          </div>

          <div style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
            <div style={{ background: '#FEF3C7', width: '50px', height: '50px', borderRadius: '50%', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <MessageSquare size={24} />
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.3rem' }}>AI Support Chat</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Instant order resolution</p>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#D97706' }}>Click bottom left widget 💬</span>
          </div>

        </div>

        {/* FAQ Accordion & Ticket Form Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2.5rem' }} className="support-grid">
          
          {/* FAQ Accordion */}
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HelpCircle size={24} color="var(--color-primary)" /> Frequently Asked Questions
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {filteredFaqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div 
                    key={idx}
                    style={{
                      background: 'white',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)',
                      overflow: 'hidden'
                    }}
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      style={{
                        width: '100%',
                        padding: '1.1rem 1.25rem',
                        textAlign: 'left',
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        color: isOpen ? 'var(--color-primary)' : 'var(--text-main)'
                      }}
                    >
                      <span>{faq.question}</span>
                      {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                    {isOpen && (
                      <div style={{ padding: '0 1.25rem 1.25rem', fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6, borderTop: '1px dashed var(--border-color)', paddingTop: '0.85rem' }}>
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit Inquiry Ticket Form */}
          <div style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', height: 'fit-content' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>Submit Support Ticket</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Have a custom query? Fill out this form and our support team will get back to you.</p>

            <form onSubmit={handleTicketSubmit}>
              <div className="input-group">
                <label className="input-label">Your Name *</label>
                <input
                  type="text"
                  required
                  value={ticketForm.name}
                  onChange={(e) => setTicketForm({ ...ticketForm, name: e.target.value })}
                  className="input-field"
                />
              </div>

              <div className="input-group">
                <label className="input-label">Email Address *</label>
                <input
                  type="email"
                  required
                  value={ticketForm.email}
                  onChange={(e) => setTicketForm({ ...ticketForm, email: e.target.value })}
                  className="input-field"
                />
              </div>

              <div className="input-group">
                <label className="input-label">Subject *</label>
                <input
                  type="text"
                  required
                  value={ticketForm.subject}
                  onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                  className="input-field"
                  placeholder="Order ID / Return Query"
                />
              </div>

              <div className="input-group">
                <label className="input-label">Message Details *</label>
                <textarea
                  rows="4"
                  required
                  value={ticketForm.message}
                  onChange={(e) => setTicketForm({ ...ticketForm, message: e.target.value })}
                  className="input-field"
                  placeholder="Describe your issue..."
                />
              </div>

              <button type="submit" className="btn btn-primary btn-full">
                <Send size={16} /> Submit Ticket
              </button>
            </form>
          </div>

        </div>

      </div>

      <style>{`
        @media (max-width: 850px) {
          .support-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};
