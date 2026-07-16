import { useEffect, useState } from "react";

export default function Toast({ message, type, onRemove }) {
  const [removing, setRemoving] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setRemoving(true);
      setTimeout(onRemove, 350);
    }, 4000);
    return () => clearTimeout(t);
  }, [onRemove]);



  const icons = { success: '✅', error: '❌' };

  return (
    <div
      role="alert"
      className={`toast flex items-center gap-3.5 px-6 py-4 rounded-2xl min-w-70 max-w-95 shadow-[0_12px_40px_rgba(0,0,0,0.14)] bg-[#131313] backdrop-blur border border-white/80 ${type === 'success' ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-red-700'} ${removing ? 'removing' : ''}`}
    >
      <span className="text-xl">{icons[type] || '📢'}</span>
      <span className="text-[14px] text-on-surface font-medium">{message}</span>
    </div>
  );
}