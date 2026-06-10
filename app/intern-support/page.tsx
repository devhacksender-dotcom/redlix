'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import SupportBottomBanner from '@/components/SupportBottomBanner';

export default function InternSupportPage() {
  const [formData, setFormData] = useState({
    name: '',
    batchNumber: '',
    college: '',
    email: '',
    problemPage: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch('/api/intern-support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus({ type: 'success', message: 'Your support request has been submitted successfully!' });
        setFormData({
          name: '',
          batchNumber: '',
          college: '',
          email: '',
          problemPage: '',
          description: '',
        });
      } else {
        const data = await response.json();
        setStatus({ type: 'error', message: data.error || 'Something went wrong.' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to submit the form. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col selection:bg-red-500 selection:text-white">
      <div className="flex-grow flex items-center justify-center p-4">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');
        
        body {
          margin: 0;
          font-family: 'Poppins', sans-serif;
          background: #0a0a0a;
          color: white;
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 0;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        .input-group {
          position: relative;
          margin-bottom: 16px;
        }

        .input-field {
          width: 100%;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0;
          padding: 10px 14px;
          color: white;
          font-size: 14px;
          transition: all 0.3s ease;
          outline: none;
        }

        .input-field:focus {
          border-color: #E61E32;
          background: rgba(255, 255, 255, 0.06);
        }

        .input-label {
          display: block;
          margin-bottom: 4px;
          font-size: 12px;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.5);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .submit-btn {
          width: 100%;
          padding: 12px;
          background: #E61E32;
          border: none;
          border-radius: 0;
          color: white;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .submit-btn:hover {
          filter: brightness(1.1);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .status-msg {
          padding: 10px;
          border-radius: 0;
          margin-bottom: 16px;
          font-size: 13px;
          text-align: center;
        }

        .status-success {
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.2);
          color: #4ade80;
        }

        .status-error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #f87171;
        }

        .glow {
          position: absolute;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(230, 30, 50, 0.1) 0%, transparent 70%);
          border-radius: 50%;
          z-index: -1;
          filter: blur(40px);
        }
      `}</style>

      <div className="glow" style={{ top: '10%', right: '10%' }}></div>
      <div className="glow" style={{ bottom: '10%', left: '10%' }}></div>

      <div className="glass-card w-full max-w-4xl p-6 md:p-10">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 mb-8 text-[11px] font-medium tracking-wide">
          <a href="/" className="text-white/30 hover:text-[#E61E32] transition-colors">Home</a>
          <span className="text-white/10">/</span>
          <span className="text-white/30">Intern</span>
          <span className="text-white/10">/</span>
          <span className="text-white/60">Support portal</span>
        </nav>

        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold mb-1 tracking-tight">
            Support <span style={{ color: '#E61E32' }}>portal</span>
          </h1>
          <p className="text-white/30 text-xs md:text-sm">
            Quick submission for technical and portal issues.
          </p>
        </div>

        {status && (
          <div className={`status-msg ${status.type === 'success' ? 'status-success' : 'status-error'}`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
            <div className="input-group">
              <label className="input-label">Full name</label>
              <input
                type="text"
                name="name"
                required
                className="input-field"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Batch number</label>
              <input
                type="text"
                name="batchNumber"
                required
                className="input-field"
                placeholder="Your batch id"
                value={formData.batchNumber}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label className="input-label">College name</label>
              <input
                type="text"
                name="college"
                required
                className="input-field"
                placeholder="Where do you study?"
                value={formData.college}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Email address</label>
              <input
                type="email"
                name="email"
                required
                className="input-field"
                placeholder="Your personal email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="input-group md:col-span-2">
              <label className="input-label">Problem page url</label>
              <input
                type="text"
                name="problemPage"
                required
                className="input-field"
                placeholder="Paste the link where you face the issue"
                value={formData.problemPage}
                onChange={handleChange}
              />
            </div>

            <div className="input-group md:col-span-2">
              <label className="input-label">Issue details</label>
              <textarea
                name="description"
                required
                className="input-field min-h-[100px] resize-none"
                placeholder="Briefly describe the issue you're facing"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="submit-btn"
            >
              {loading ? 'Submitting...' : 'Submit request'}
            </button>
          </div>
        </form>
      </div>
      </div>
      <SupportBottomBanner />
    </div>
  );
}
