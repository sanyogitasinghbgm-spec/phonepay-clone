import { useNavigate } from 'react-router-dom';

const PageHeader = ({ title, onBack }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-3 px-5 pt-6 pb-4 bg-white">
      <button
        onClick={onBack || (() => navigate(-1))}
        className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50 active:scale-95 transition"
        aria-label="Go back"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M15 18l-6-6 6-6" stroke="#1A1A2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <h1 className="font-display font-semibold text-lg text-ink">{title}</h1>
    </div>
  );
};

export default PageHeader;
