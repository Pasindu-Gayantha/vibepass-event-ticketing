import { useState } from 'react';
import { Send, User, Mail, Phone, Music, Users, MessageSquare, CheckCircle2, Loader2 } from 'lucide-react';
import { createInquiry } from '@/lib/data';

export default function OrganizerForm() {
  const [form, setForm] = useState({
    organizerName: '',
    email: '',
    phone: '',
    eventConcept: '',
    expectedAttendees: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.organizerName.trim()) e.organizerName = 'Organizer name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.phone.trim()) e.phone = 'Phone is required';
    if (!form.eventConcept.trim()) e.eventConcept = 'Event concept is required';
    if (!form.expectedAttendees.trim()) e.expectedAttendees = 'Expected attendees is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await createInquiry({
        organizer_name: form.organizerName,
        email: form.email,
        phone: form.phone,
        event_concept: form.eventConcept,
        expected_attendees: parseInt(form.expectedAttendees) || 100,
        notes: form.notes || null,
      });
      setSubmitted(true);
    } catch {
      setErrors({ submit: 'Submission failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-20 pb-12 px-4 flex items-center justify-center">
        <div className="w-full max-w-md text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500/30">
            <CheckCircle2 className="w-12 h-12 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Proposal Submitted!</h1>
          <p className="text-gray-400">
            Thank you, {form.organizerName}! Our team will review your event concept and reach out within 48 hours.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setForm({ organizerName: '', email: '', phone: '', eventConcept: '', expectedAttendees: '', notes: '' });
            }}
            className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-all border border-purple-500/15"
          >
            Submit Another Proposal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-rose-400 text-sm font-medium mb-4">
            <Music className="w-4 h-4" /> B2B Organizer Partnership
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Host Your Event</h1>
          <p className="text-gray-400">Partner with VibePass to sell tickets for your concert, festival, or acoustic night.</p>
        </div>

        <div className="bg-[#0a0a0f] rounded-3xl border border-purple-500/20 p-6 sm:p-8 space-y-5">
          {/* Name */}
          <div>
            <label className="text-gray-400 text-xs font-medium uppercase mb-1.5 flex items-center gap-1">
              <User className="w-3 h-3" /> Organizer Name
            </label>
            <input
              type="text"
              value={form.organizerName}
              onChange={(e) => handleChange('organizerName', e.target.value)}
              placeholder="Your name or company"
              className={`w-full bg-white/5 border rounded-xl px-3 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none transition-all ${
                errors.organizerName ? 'border-red-500/50' : 'border-purple-500/15 focus:border-rose-500/50'
              }`}
            />
            {errors.organizerName && <p className="text-red-400 text-xs mt-1">{errors.organizerName}</p>}
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-xs font-medium uppercase mb-1.5 flex items-center gap-1">
                <Mail className="w-3 h-3" /> Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="you@example.com"
                className={`w-full bg-white/5 border rounded-xl px-3 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none transition-all ${
                  errors.email ? 'border-red-500/50' : 'border-purple-500/15 focus:border-rose-500/50'
                }`}
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="text-gray-400 text-xs font-medium uppercase mb-1.5 flex items-center gap-1">
                <Phone className="w-3 h-3" /> Phone
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="0771234567"
                className={`w-full bg-white/5 border rounded-xl px-3 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none transition-all ${
                  errors.phone ? 'border-red-500/50' : 'border-purple-500/15 focus:border-rose-500/50'
                }`}
              />
              {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
            </div>
          </div>

          {/* Event Concept */}
          <div>
            <label className="text-gray-400 text-xs font-medium uppercase mb-1.5 flex items-center gap-1">
              <Music className="w-3 h-3" /> Event Concept
            </label>
            <textarea
              value={form.eventConcept}
              onChange={(e) => handleChange('eventConcept', e.target.value)}
              placeholder="Describe your event - genre, venue, dates, lineup..."
              rows={3}
              className={`w-full bg-white/5 border rounded-xl px-3 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none transition-all resize-none ${
                errors.eventConcept ? 'border-red-500/50' : 'border-purple-500/15 focus:border-rose-500/50'
              }`}
            />
            {errors.eventConcept && <p className="text-red-400 text-xs mt-1">{errors.eventConcept}</p>}
          </div>

          {/* Expected Attendees */}
          <div>
            <label className="text-gray-400 text-xs font-medium uppercase mb-1.5 flex items-center gap-1">
              <Users className="w-3 h-3" /> Expected Attendees
            </label>
            <input
              type="number"
              value={form.expectedAttendees}
              onChange={(e) => handleChange('expectedAttendees', e.target.value)}
              placeholder="e.g. 500"
              className={`w-full bg-white/5 border rounded-xl px-3 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none transition-all ${
                errors.expectedAttendees ? 'border-red-500/50' : 'border-purple-500/15 focus:border-rose-500/50'
              }`}
            />
            {errors.expectedAttendees && <p className="text-red-400 text-xs mt-1">{errors.expectedAttendees}</p>}
          </div>

          {/* Notes */}
          <div>
            <label className="text-gray-400 text-xs font-medium uppercase mb-1.5 flex items-center gap-1">
              <MessageSquare className="w-3 h-3" /> Additional Notes
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Any special requirements, budget range, preferred dates..."
              rows={2}
              className="w-full bg-white/5 border border-purple-500/15 rounded-xl px-3 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-rose-500/50 transition-all resize-none"
            />
          </div>

          {errors.submit && <p className="text-red-400 text-sm text-center">{errors.submit}</p>}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-400 hover:to-purple-500 text-white font-bold py-3 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/25 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Submit Proposal
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
