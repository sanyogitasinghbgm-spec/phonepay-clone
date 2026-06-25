import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import Toast from '../components/Toast.jsx';
import { useToast } from '../components/useToast.js';
import PageHeader from '../components/PageHeader.jsx';

const SetupMpin = () => {
  const [mpin, setMpin] = useState('');
  const [loading, setLoading] = useState(false);
  const { refreshUser } = useAuth();
  const { toast, showToast, closeToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const firstTime = location.state?.firstTime;

  const handleKey = (digit) => {
    if (mpin.length >= 6) return;
    setMpin(mpin + digit);
  };

  const handleBackspace = () => setMpin(mpin.slice(0, -1));

  const handleSubmit = async () => {
    if (mpin.length < 4) {
      showToast('MPIN must be at least 4 digits', 'error');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/setup-mpin', { mpin });
      await refreshUser();
      showToast('MPIN set successfully!');
      setTimeout(() => navigate('/'), 700);
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not set MPIN', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-frame flex flex-col">
      <Toast message={toast.message} type={toast.type} onClose={closeToast} />

      {!firstTime && <PageHeader title="Set MPIN" />}

      <div className="flex-1 flex flex-col items-center px-6 pt-12">
        {firstTime && (
          <div className="text-center mb-8">
            <h1 className="font-display text-xl font-semibold text-ink">One last step</h1>
            <p className="text-sm text-gray-500 mt-1">Set a 4–6 digit MPIN to secure your transactions</p>
          </div>
        )}

        {/* Dots display */}
        <div className="flex gap-3 mb-10">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`w-3.5 h-3.5 rounded-full border-2 transition ${
                i < mpin.length ? 'bg-brand border-brand' : 'border-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-xs">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <button
              key={n}
              onClick={() => handleKey(String(n))}
              className="aspect-square rounded-2xl bg-white shadow-sm text-xl font-display font-semibold text-ink active:bg-gray-100 transition"
            >
              {n}
            </button>
          ))}
          <div />
          <button
            onClick={() => handleKey('0')}
            className="aspect-square rounded-2xl bg-white shadow-sm text-xl font-display font-semibold text-ink active:bg-gray-100 transition"
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            className="aspect-square rounded-2xl flex items-center justify-center text-gray-400 active:text-gray-600"
            aria-label="Backspace"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 6h10v12H9l-6-6 6-6Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <path d="M13 10l4 4m0-4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || mpin.length < 4}
          className="w-full max-w-xs mt-10 bg-brand text-white font-display font-semibold py-3 rounded-xl active:scale-[0.98] transition disabled:opacity-40"
        >
          {loading ? 'Saving…' : 'Confirm MPIN'}
        </button>
      </div>
    </div>
  );
};

export default SetupMpin;
