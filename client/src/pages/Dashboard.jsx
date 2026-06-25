import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import BottomNav from '../components/BottomNav.jsx';

const quickActions = [
  {
    to: '/send',
    label: 'Send Money',
    bg: 'bg-brand/10',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M4 12h14M13 6l6 6-6 6" stroke="#5F259F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    to: '/add-money',
    label: 'Add Money',
    bg: 'bg-green-50',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 5v14M5 12h14" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    to: '/pay-bill',
    label: 'Pay Bills',
    bg: 'bg-amber-50',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="4" width="16" height="16" rx="2" stroke="#D97706" strokeWidth="1.8" />
        <path d="M8 9h8M8 13h8M8 17h4" stroke="#D97706" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    to: '/history',
    label: 'History',
    bg: 'bg-blue-50',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const txnIcon = (type) => {
  if (type === 'ADD_MONEY') return { symbol: '+', color: 'text-green-600', bg: 'bg-green-50' };
  if (type === 'BILL_PAY') return { symbol: '⚡', color: 'text-amber-600', bg: 'bg-amber-50' };
  return { symbol: '↗', color: 'text-brand', bg: 'bg-brand/10' };
};

const Dashboard = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loadingTxns, setLoadingTxns] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await api.get('/transactions/history');
        setTransactions(data.slice(0, 5));
      } catch (err) {
        // silently ignore - dashboard still works without recent txns
      } finally {
        setLoadingTxns(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="app-frame pb-24">
      {/* Top bar */}
      <div className="bg-gradient-to-br from-brand to-brand-dark px-6 pt-10 pb-8 rounded-b-[2rem] relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-44 h-44 rounded-full bg-white/10" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-white/70 text-xs">Welcome back</p>
            <h1 className="font-display text-white text-lg font-semibold">{user?.name?.split(' ')[0]}</h1>
          </div>
          <Link
            to="/profile"
            className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center text-white font-display font-semibold"
          >
            {user?.name?.[0]?.toUpperCase()}
          </Link>
        </div>

        {/* Balance card */}
        <div className="relative z-10 mt-6 bg-white/10 backdrop-blur rounded-2xl p-5 border border-white/15">
          <p className="text-white/70 text-xs">Available balance</p>
          <p className="font-display text-white text-3xl font-semibold mt-1">
            ₹{user?.balance?.toLocaleString('en-IN') ?? '0'}
          </p>
          <p className="text-white/60 text-[11px] mt-2 truncate">{user?.upiId}</p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="px-6 -mt-6 relative z-10">
        <div className="bg-white rounded-2xl shadow-card p-4 grid grid-cols-4 gap-2">
          {quickActions.map((action) => (
            <Link key={action.to} to={action.to} className="flex flex-col items-center gap-2">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${action.bg}`}>
                {action.icon}
              </div>
              <span className="text-[11px] text-gray-600 text-center leading-tight">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent transactions */}
      <div className="px-6 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-semibold text-ink text-sm">Recent activity</h2>
          <Link to="/history" className="text-xs text-brand font-medium">
            View all
          </Link>
        </div>

        {loadingTxns ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-16 rounded-xl" />
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl">
            <p className="text-sm text-gray-400">No transactions yet</p>
            <p className="text-xs text-gray-400 mt-1">Send or add money to get started</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl divide-y divide-gray-50 overflow-hidden">
            {transactions.map((txn) => {
              const isCredit = txn.receiver?._id === user?._id || txn.type === 'ADD_MONEY';
              const meta = txnIcon(txn.type);
              const counterparty =
                txn.type === 'BILL_PAY'
                  ? txn.billerName
                  : txn.type === 'ADD_MONEY'
                  ? 'Bank transfer'
                  : isCredit
                  ? txn.sender?.name
                  : txn.receiver?.name;

              return (
                <div key={txn._id} className="flex items-center gap-3 px-4 py-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${meta.bg} ${meta.color} font-semibold`}>
                    {meta.symbol}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink truncate">{counterparty || 'Transaction'}</p>
                    <p className="text-[11px] text-gray-400">
                      {new Date(txn.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                  <p className={`text-sm font-semibold ${isCredit ? 'text-green-600' : 'text-ink'}`}>
                    {isCredit ? '+' : '-'}₹{txn.amount}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
