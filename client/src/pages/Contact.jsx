import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const { showToast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('Thank you! Your message has been sent to Draksha.', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-gold">Get In Touch</span>
        <h1 className="font-serif text-4xl sm:text-5xl font-extrabold text-brand-ivory">
          Contact <span className="gold-gradient-text">Draksha</span>
        </h1>
        <p className="text-xs sm:text-sm text-brand-muted max-w-xl mx-auto">
          We would love to hear from you. Reach out for catering, feedback, or table reservations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Contact Info & Opening Hours */}
        <div className="space-y-6">
          <div className="bg-brand-card border border-brand-border/80 p-8 rounded-3xl space-y-6">
            <h2 className="font-serif text-2xl font-bold text-brand-ivory border-b border-brand-border/60 pb-3">
              Restaurant Information
            </h2>

            <div className="space-y-4 text-xs sm:text-sm text-brand-ivory/90">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-brand-gold">Location Address</strong>
                  <span className="text-brand-muted">45 Gourmet Avenue, Chocolate District, Hyderabad, India</span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-brand-gold">Phone Number</strong>
                  <span className="text-brand-muted">+91 98765 43210</span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-brand-gold">Email Support</strong>
                  <span className="text-brand-muted">contact@draksha.com</span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-brand-gold">Operating Hours</strong>
                  <span className="text-brand-goldLight">11:00 AM – 11:30 PM (Everyday)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Location Placeholder Map */}
          <div className="bg-brand-card border border-brand-border/80 p-6 rounded-3xl text-center space-y-3">
            <MapPin className="w-8 h-8 text-brand-gold mx-auto" />
            <h3 className="font-serif text-lg font-bold text-brand-ivory">Visit Us In Person</h3>
            <p className="text-xs text-brand-muted">
              Located conveniently in the heart of the food & dessert corridor.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-brand-card border border-brand-border/80 p-8 rounded-3xl space-y-6">
          <h2 className="font-serif text-2xl font-bold text-brand-ivory border-b border-brand-border/60 pb-3">
            Send Us A Message
          </h2>

          {submitted ? (
            <div className="text-center py-10 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="font-serif text-xl font-bold text-brand-ivory">Message Sent Successfully!</h3>
              <p className="text-xs text-brand-muted">We will get back to you shortly.</p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs text-brand-gold font-bold hover:underline"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-brand-muted mb-1 font-medium">Your Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-brand-dark border border-brand-border focus:border-brand-gold text-brand-ivory rounded-xl p-3 outline-none"
                />
              </div>

              <div>
                <label className="block text-brand-muted mb-1 font-medium">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full bg-brand-dark border border-brand-border focus:border-brand-gold text-brand-ivory rounded-xl p-3 outline-none"
                />
              </div>

              <div>
                <label className="block text-brand-muted mb-1 font-medium">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-brand-dark border border-brand-border focus:border-brand-gold text-brand-ivory rounded-xl p-3 outline-none"
                />
              </div>

              <div>
                <label className="block text-brand-muted mb-1 font-medium">Message / Feedback *</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what you loved or how we can help..."
                  className="w-full bg-brand-dark border border-brand-border focus:border-brand-gold text-brand-ivory rounded-xl p-3 outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-gold to-brand-goldHover text-brand-dark font-extrabold text-xs shadow-gold hover:scale-[1.01] transition flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Message</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
