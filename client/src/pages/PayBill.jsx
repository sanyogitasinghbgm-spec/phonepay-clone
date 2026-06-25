import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Toast from '../components/Toast.jsx';
import { useToast } from '../components/useToast.js';

const billers = [
  { name: 'Jio Mobile Recharge', icon: '📱' },
  { name: 'Airtel Postpaid', icon: '📶' },
  { name: 'Adani Electricity', icon: '💡' },
  { name: 'Indane Gas', icon: '🔥' },
];

const PayBill = () => {
  const [step, setStep] = useState(1);
  const [billerName, setBillerName] = useState('');
  const [amount, setAmount] = useState('');
  const [mpin, setMpin] = useState('');
  const [loading, setLoading] = useState(false);
  const { refreshUser } = useAuth();
  const { toast, showToast, closeToast } = useToast();
  const navigate = useNavigate();

  const selectBiller = (name) => {
    setBillerName(name);
    setStep(2);
  };

  const handleContinue = (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      showToast('Enter a valid amount', 'error');
      return;
    }
    setStep(3);
  };

  const handlePay = async () => {
    if (mpin.length < 4) {
      showToast('Enter your MPIN', 'error');
      return;
    }
    setLoading(true);
    try {
      await api.post('/wallet/pay-bill', { billerName, amount: Number(amount), mpin });
      await refreshUser();
      showToast('Bill paid successfully!');
      setTimeout(() => navigate('/'), 900);
    } catch (err) {
      showToast(err.response?.data?.message || 'Payment failed', 'error');
      setMpin('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-frame flex flex-col">
      <Toast message={toast.message} type={toast.type} onClose={closeToast} />
      <PageHeader
        title="Pay Bills"
        onBack={step > 1 ? () => setStep(step - 1) : undefined}
      />

      {step === 1 && (
        <div className="flex-1 px-6 pt-4">
          <p className="text-xs text-gray-500 mb-3">Choose a biller</p>
          <div className="grid grid-cols-2 gap-3">
            {billers.map((b) => (
              <button
                key={b.name}
                onClick={() => selectBiller(b.name)}
                className="bg-white rounded-xl p-4 flex flex-col items-center gap-2 shadow-sm active:scale-95 transition"
              >
                <span className="text-2xl">{b.icon}</span>
                <span className="text-xs font-medium text-ink text-center leading-tight">{b.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <form onSubmit={handleContinue} className="flex-1 px-6 pt-4 space-y-4">
          <div className="bg-amber-50 rounded-xl p-3 text-sm text-amber-700 font-medium">{billerName}</div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Bill amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-display">₹</span>
              <input
                type="number"
                required
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="w-full pl-8 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-lg font-display font-semibold focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-brand text-white font-display font-semibold py-3 rounded-xl active:scale-[0.98] transition mt-2"
          >
            Continue
          </button>
        </form>
      )}

      {step === 3 && (
        <div className="flex-1 px-6 pt-6 flex flex-col items-center">
          <p className="text-sm text-gray-500">Paying {billerName}</p>
          <p className="font-display text-2xl font-semibold text-ink mt-1">₹{amount}</p>

          <p className="text-xs text-gray-500 mt-8 mb-3">Enter your MPIN to confirm</p>
          <div className="flex gap-3 mb-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className={`w-3.5 h-3.5 rounded-full border-2 ${i < mpin.length ? 'bg-brand border-brand' : 'border-gray-300'}`}
              />
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 w-full max-w-xs">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <button
                key={n}
                onClick={() => mpin.length < 6 && setMpin(mpin + n)}
                className="aspect-square rounded-2xl bg-white shadow-sm text-xl font-display font-semibold text-ink active:bg-gray-100"
              >
                {n}
              </button>
            ))}
            <div />
            <button
              onClick={() => mpin.length < 6 && setMpin(mpin + '0')}
              className="aspect-square rounded-2xl bg-white shadow-sm text-xl font-display font-semibold text-ink active:bg-gray-100"
            >
              0
            </button>
            <button
              onClick={() => setMpin(mpin.slice(0, -1))}
              className="aspect-square rounded-2xl flex items-center justify-center text-gray-400"
            >
              ⌫
            </button>
          </div>

          <button
            onClick={handlePay}
            disabled={loading || mpin.length < 4}
            className="w-full max-w-xs mt-8 bg-brand text-white font-display font-semibold py-3 rounded-xl active:scale-[0.98] transition disabled:opacity-40"
          >
            {loading ? 'Processing…' : `Pay ₹${amount}`}
          </button>
        </div>
      )}
    </div>
  );
};

export default PayBill;
