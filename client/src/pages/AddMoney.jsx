import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Toast from '../components/Toast.jsx';
import { useToast } from '../components/useToast.js';

const presets = [100, 500, 1000, 2000];

const AddMoney = () => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const { refreshUser } = useAuth();
  const { toast, showToast, closeToast } = useToast();
  const navigate = useNavigate();

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      showToast('Enter a valid amount', 'error');
      return;
    }
    setLoading(true);
    try {
      await api.post('/wallet/add-money', { amount: Number(amount) });
      await refreshUser();
      showToast('Money added to wallet!');
      setTimeout(() => navigate('/'), 800);
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not add money', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-frame flex flex-col">
      <Toast message={toast.message} type={toast.type} onClose={closeToast} />
      <PageHeader title="Add Money" />

      <form onSubmit={handleAdd} className="flex-1 px-6 pt-6 space-y-5">
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">Amount to add</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-display text-xl">₹</span>
            <input
              type="number"
              required
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="w-full pl-9 pr-4 py-4 rounded-xl bg-gray-50 border border-gray-200 text-2xl font-display font-semibold focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand"
            />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {presets.map((p) => (
            <button
              type="button"
              key={p}
              onClick={() => setAmount(String(p))}
              className="py-2 rounded-xl bg-brand/10 text-brand text-sm font-medium active:scale-95 transition"
            >
              ₹{p}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-semibold">
            🏦
          </div>
          <div className="text-sm">
            <p className="font-medium text-ink">Linked Bank Account</p>
            <p className="text-gray-400 text-xs">Simulated transfer for this demo</p>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand text-white font-display font-semibold py-3 rounded-xl active:scale-[0.98] transition disabled:opacity-60"
        >
          {loading ? 'Adding…' : `Add ₹${amount || 0}`}
        </button>
      </form>
    </div>
  );
};

export default AddMoney;
