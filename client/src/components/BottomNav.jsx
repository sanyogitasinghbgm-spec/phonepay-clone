import { NavLink } from 'react-router-dom';

const navItems = [
  {
    to: '/',
    label: 'Home',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10.5Z"
          stroke={active ? '#5F259F' : '#8C8A99'}
          strokeWidth="1.8"
          strokeLinejoin="round"
          fill={active ? '#5F259F1A' : 'none'}
        />
      </svg>
    ),
  },
  {
    to: '/history',
    label: 'History',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5"
          stroke={active ? '#5F259F' : '#8C8A99'}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M12 8v4l3 2" stroke={active ? '#5F259F' : '#8C8A99'} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    to: '/profile',
    label: 'Profile',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="3.5" stroke={active ? '#5F259F' : '#8C8A99'} strokeWidth="1.8" />
        <path
          d="M4.5 20c1.4-3.4 4.4-5 7.5-5s6.1 1.6 7.5 5"
          stroke={active ? '#5F259F' : '#8C8A99'}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40">
      <div className="app-frame !min-h-0 !p-0 !shadow-none !rounded-none">
        <div className="bg-white border-t border-gray-100 flex justify-around py-2 px-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className="flex flex-col items-center gap-0.5 py-1 px-4 rounded-xl"
            >
              {({ isActive }) => (
                <>
                  {item.icon(isActive)}
                  <span className={`text-[11px] font-medium ${isActive ? 'text-brand' : 'text-gray-500'}`}>
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
