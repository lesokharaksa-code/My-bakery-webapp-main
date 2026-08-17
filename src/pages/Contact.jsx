import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig'; 

export default function Contact() {
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); 

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validate fields
    if (!formData.fname.trim()) newErrors.fname = true;
    if (!formData.lname.trim()) newErrors.lname = true;
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = true;
    if (!formData.subject) newErrors.subject = true;
    if (!formData.message.trim()) newErrors.message = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
      setIsSubmitting(true);

      try {
        // 2. Save form data to Firestore 'messages' collection
        await addDoc(collection(db, 'messages'), {
          fname: formData.fname,
          lname: formData.lname,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          status: 'unread', 
          createdAt: serverTimestamp(), 
        });

        setIsSubmitted(true);
        setFormData({ fname: '', lname: '', email: '', subject: '', message: '' });
      } catch (error) {
        console.error('Error saving message to Firestore:', error);
        alert('Failed to send message. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div id="contact">
      <div className="contact-wrap">
        {/* Contact Info Side */}
        <div className="contact-info-side">
          <div className="eyebrow">Find Us</div>
          <h2>
            Come Say<br />
            <em style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 400 }}>Hi</em>
          </h2>
          <p className="sub">We'd love to welcome you in-store or answer any questions.</p>
          
          <div className="info-row">
            <div className="info-icon">📍</div>
            <div>
              <div className="info-lbl">Address</div>
              <div className="info-val">Royal University Of Phnom Penh <br />Open City</div>
            </div>
          </div>

          <div className="info-row">
            <div className="info-icon">🕐</div>
            <div>
              <div className="info-lbl">Hours</div>
              <div className="info-val">
                Mon–Fri: 7:00 AM – 8:00 PM<br />
                Sat: 8:00 AM – 9:00 PM<br />
                Sunday: Closed
              </div>
            </div>
          </div>

          <div className="info-row">
            <div className="info-icon">📞</div>
            <div>
              <div className="info-lbl">Phone</div>
              <div className="info-val">(855) 234-5678</div>
            </div>
          </div>

          <div className="info-row">
            <div className="info-icon">✉️</div>
            <div>
              <div className="info-lbl">Email</div>
              <div className="info-val">hello@crumbsandcups.com</div>
            </div>
          </div>
        </div>

        {/* Contact Form Side */}
        <form className="contact-form-side" onSubmit={handleSubmit} noValidate>
          <h3>Send a Message</h3>
          
          <div className="f-row">
            <div className="f-group">
              <label>First Name</label>
              <input
                id="fname"
                type="text"
                placeholder="Sokha"
                value={formData.fname}
                onChange={handleChange}
              />
              {errors.fname && <div className="f-err" id="err-fname" style={{ display: 'block' }}>Required</div>}
            </div>

            <div className="f-group">
              <label>Last Name</label>
              <input
                id="lname"
                type="text"
                placeholder="Raksa"
                value={formData.lname}
                onChange={handleChange}
              />
              {errors.lname && <div className="f-err" id="err-lname" style={{ display: 'block' }}>Required</div>}
            </div>
          </div>

          <div className="f-group">
            <label>Email</label>
            <input
              id="email"
              type="email"
              placeholder="SokhRaksa@example.com"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <div className="f-err" id="err-email" style={{ display: 'block' }}>Valid email required</div>}
          </div>

          <div className="f-group">
            <label>Subject</label>
            <select id="subject" value={formData.subject} onChange={handleChange}>
              <option value="">Select a subject...</option>
              <option>General Enquiry</option>
              <option>Custom Cake Order</option>
              <option>Catering Request</option>
              <option>Feedback</option>
            </select>
            {errors.subject && <div className="f-err" id="err-subject" style={{ display: 'block' }}>Please select a subject</div>}
          </div>

          <div className="f-group">
            <label>Message</label>
            <textarea
              id="message"
              placeholder="Write your message here..."
              value={formData.message}
              onChange={handleChange}
            ></textarea>
            {errors.message && <div className="f-err" id="err-message" style={{ display: 'block' }}>Required</div>}
          </div>

          <button type="submit" className="btn-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>

          {isSubmitted && (
            <div className="success-box" id="success-msg" style={{ display: 'block' }}>
              ✓ Message sent! We'll reply within 24 hours.
            </div>
          )}
        </form>
      </div>
    </div>
  );
}