import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Toast from '../components/Toast.jsx';
import { useToast } from '../components/useToast.js';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { toast, showToast, closeToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      showToast(err.response?.data?.message || 'Login failed. Try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-frame flex flex-col">
      <Toast message={toast.message} type={toast.type} onClose={closeToast} />

      {/* Hero panel */}
      <div className="bg-gradient-to-br from-brand to-brand-dark px-6 pt-14 pb-16 rounded-b-[2.5rem] relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10" />
        <div className="absolute right-8 top-20 w-16 h-16 rounded-full bg-brand-accent/20" />
        <div className="relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center font-display font-bold text-brand text-xl shadow-card">
            ₹
          </div>
          <h1 className="font-display text-white text-2xl font-semibold mt-6">Welcome back</h1>
          <p className="text-white/70 text-sm mt-1">Log in to send and receive money instantly</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 px-6 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-card p-5 space-y-4">
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
            <label className="text-xs font-medium text-gray-500 mb-1 block">Password</label>
            <input
              type="password"
              name="password"
              required
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand text-white font-display font-semibold py-3 rounded-xl active:scale-[0.98] transition disabled:opacity-60"
          >
            {loading ? 'Logging in…' : 'Log In'}
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          New to PhonePay?{' '}
          <Link to="/register" className="text-brand font-semibold">
            Create account
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
