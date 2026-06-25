import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import BottomNav from '../components/BottomNav.jsx';

const menuItems = (hasMpinSet, navigate) => [
  {
    label: hasMpinSet ? 'Change MPIN' : 'Set up MPIN',
    icon: '🔒',
    onClick: () => navigate('/setup-mpin'),
  },
  {
    label: 'Add Money',
    icon: '➕',
    onClick: () => navigate('/add-money'),
  },
  {
    label: 'Transaction History',
    icon: '🧾',
    onClick: () => navigate('/history'),
  },
];

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-frame pb-24">
      <div className="bg-gradient-to-br from-brand to-brand-dark px-6 pt-10 pb-12 rounded-b-[2rem] relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/15 flex items-center justify-center text-white font-display text-2xl font-semibold">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h1 className="font-display text-white text-lg font-semibold">{user?.name}</h1>
            <p className="text-white/70 text-xs mt-0.5">{user?.phone}</p>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-6 relative z-10">
        <div className="bg-white rounded-2xl shadow-card p-4">
          <p className="text-xs text-gray-400">UPI ID</p>
          <p className="text-sm font-medium text-ink mt-0.5">{user?.upiId}</p>
          <div className="h-px bg-gray-100 my-3" />
          <p className="text-xs text-gray-400">Email</p>
          <p className="text-sm font-medium text-ink mt-0.5">{user?.email}</p>
        </div>
      </div>

      <div className="px-6 mt-5 space-y-2">
        {menuItems(user?.hasMpinSet, navigate).map((item) => (
          <button
            key={item.label}
            onClick={item.onClick}
            className="w-full bg-white rounded-xl px-4 py-3.5 flex items-center gap-3 active:bg-gray-50 transition"
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-sm font-medium text-ink flex-1 text-left">{item.label}</span>
            <span className="text-gray-300">›</span>
          </button>
        ))}

        <button
          onClick={handleLogout}
          className="w-full bg-white rounded-xl px-4 py-3.5 flex items-center gap-3 active:bg-gray-50 transition mt-4"
        >
          <span className="text-lg">🚪</span>
          <span className="text-sm font-medium text-red-500 flex-1 text-left">Log out</span>
        </button>
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;
