const Toast = ({ message, type = 'success', onClose }) => {
  if (!message) return null;

  const styles =
    type === 'error'
      ? 'bg-red-50 text-red-700 border-red-200'
      : 'bg-green-50 text-green-700 border-green-200';

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm border ${styles} rounded-xl px-4 py-3 shadow-card flex items-start justify-between gap-3 animate-[fadeIn_0.2s_ease]`}
      role="alert"
    >
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="text-current opacity-60 hover:opacity-100 leading-none text-lg">
        &times;
      </button>
    </div>
  );
};

export default Toast;
