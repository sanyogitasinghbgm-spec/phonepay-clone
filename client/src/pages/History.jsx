import { useEffect, useState } from 'react';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import BottomNav from '../components/BottomNav.jsx';

const typeMeta = {
  TRANSFER: { color: 'text-brand', bg: 'bg-brand/10', symbol: '↗' },
  ADD_MONEY: { color: 'text-green-600', bg: 'bg-green-50', symbol: '+' },
  BILL_PAY: { color: 'text-amber-600', bg: 'bg-amber-50', symbol: '⚡' },
  WITHDRAW: { color: 'text-red-600', bg: 'bg-red-50', symbol: '↓' },
};

const History = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await api.get('/transactions/history');
        setTransactions(data);
      } catch (err) {
        // page still renders empty state on failure
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filtered =
    filter === 'ALL' ? transactions : transactions.filter((t) => t.type === filter);

  return (
    <div className="app-frame pb-24">
      <div className="px-6 pt-6 pb-4 bg-white">
        <h1 className="font-display font-semibold text-lg text-ink">Transaction History</h1>

        <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
          {['ALL', 'TRANSFER', 'ADD_MONEY', 'BILL_PAY'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
                filter === f ? 'bg-brand text-white' : 'bg-gray-100 text-gray-500'
              }`}
            >
              {f === 'ALL' ? 'All' : f === 'TRANSFER' ? 'Sent' : f === 'ADD_MONEY' ? 'Added' : 'Bills'}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 pt-4">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton h-16 rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-sm text-gray-400">No transactions found</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl divide-y divide-gray-50 overflow-hidden">
            {filtered.map((txn) => {
              const isCredit = txn.receiver?._id === user?._id || txn.type === 'ADD_MONEY';
              const meta = typeMeta[txn.type] || typeMeta.TRANSFER;
              const counterparty =
                txn.type === 'BILL_PAY'
                  ? txn.billerName
                  : txn.type === 'ADD_MONEY'
                  ? 'Added to wallet'
                  : isCredit
                  ? txn.sender?.name
                  : txn.receiver?.name;

              return (
                <div key={txn._id} className="flex items-center gap-3 px-4 py-3.5">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${meta.bg} ${meta.color} font-semibold`}>
                    {meta.symbol}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink truncate">{counterparty || 'Transaction'}</p>
                    <p className="text-[11px] text-gray-400">
                      {new Date(txn.createdAt).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${isCredit ? 'text-green-600' : 'text-ink'}`}>
                      {isCredit ? '+' : '-'}₹{txn.amount}
                    </p>
                    <p className="text-[10px] text-gray-400">{txn.status}</p>
                  </div>
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

export default History;
