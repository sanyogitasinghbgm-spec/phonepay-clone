import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Toast from '../components/Toast.jsx';
import { useToast } from '../components/useToast.js';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { toast, showToast, closeToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      navigate('/setup-mpin', { state: { firstTime: true } });
    } catch (err) {
      showToast(err.response?.data?.message || 'Registration failed. Try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-frame flex flex-col">
      <Toast message={toast.message} type={toast.type} onClose={closeToast} />

      <div className="bg-gradient-to-br from-brand to-brand-dark px-6 pt-14 pb-16 rounded-b-[2.5rem] relative overflow-hidden">
        <div className="absolute -left-10 -top-10 w-40 h-40 rounded-full bg-white/10" />
        <div className="relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center font-display font-bold text-brand text-xl shadow-card">
            ₹
          </div>
          <h1 className="font-display text-white text-2xl font-semibold mt-6">Create account</h1>
          <p className="text-white/70 text-sm mt-1">You'll get a UPI ID instantly on signup</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 px-6 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-card p-5 space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Full name</label>
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Email</label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Phone number</label>
            <input
              type="tel"
              name="phone"
              required
              pattern="[0-9]{10}"
              value={form.phone}
              onChange={handleChange}
              placeholder="10-digit number"
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Password</label>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              value={form.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand text-white font-display font-semibold py-3 rounded-xl active:scale-[0.98] transition disabled:opacity-60"
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-brand font-semibold">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
