import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Toast from '../components/Toast.jsx';
import { useToast } from '../components/useToast.js';

const SendMoney = () => {
  const [step, setStep] = useState(1); // 1: details, 2: mpin
  const [receiverIdentifier, setReceiverIdentifier] = useState('');
  const [amount, setAmount] = useState('');
  const [mpin, setMpin] = useState('');
  const [loading, setLoading] = useState(false);
  const { refreshUser } = useAuth();
  const { toast, showToast, closeToast } = useToast();
  const navigate = useNavigate();

  const handleContinue = (e) => {
    e.preventDefault();
    if (!receiverIdentifier || !amount || Number(amount) <= 0) {
      showToast('Enter a valid receiver and amount', 'error');
      return;
    }
    setStep(2);
  };

  const handlePay = async () => {
    if (mpin.length < 4) {
      showToast('Enter your MPIN', 'error');
      return;
    }
    setLoading(true);
    try {
      await api.post('/transactions/send', { receiverIdentifier, amount: Number(amount), mpin });
      await refreshUser();
      showToast('Money sent successfully!');
      setTimeout(() => navigate('/'), 900);
    } catch (err) {
      showToast(err.response?.data?.message || 'Transaction failed', 'error');
      setMpin('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-frame flex flex-col">
      <Toast message={toast.message} type={toast.type} onClose={closeToast} />
      <PageHeader title="Send Money" onBack={step === 2 ? () => setStep(1) : undefined} />

      {step === 1 ? (
        <form onSubmit={handleContinue} className="flex-1 px-6 pt-4 space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Phone number or UPI ID</label>
            <input
              type="text"
              required
              value={receiverIdentifier}
              onChange={(e) => setReceiverIdentifier(e.target.value)}
              placeholder="e.g. amit123@phonepe or 9876543210"
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Amount</label>
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
            className="w-full bg-brand text-white font-display font-semibold py-3 rounded-xl active:scale-[0.98] transition mt-4"
          >
            Continue
          </button>
        </form>
      ) : (
        <div className="flex-1 px-6 pt-6 flex flex-col items-center">
          <p className="text-sm text-gray-500">Paying</p>
          <p className="font-display text-2xl font-semibold text-ink mt-1">₹{amount}</p>
          <p className="text-xs text-gray-400 mt-1 truncate max-w-full">to {receiverIdentifier}</p>

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

export default SendMoney;
