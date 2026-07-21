import toast from 'react-hot-toast';

export function showSuccessToast(message, subtext) {
  toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? 'animate-slide-in-right' : 'animate-fade-out'
        } flex items-start gap-3 bg-white rounded-xl shadow-lg border-l-4 border-emerald-500 px-4 py-3 min-w-[320px] max-w-[420px] pointer-events-auto`}
      >
        <span className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 text-sm font-bold">
          ✓
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900">{message}</p>
          {subtext && (
            <p className="text-xs text-gray-500 mt-0.5">{subtext}</p>
          )}
        </div>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 text-sm leading-none cursor-pointer"
        >
          ✕
        </button>
      </div>
    ),
    { duration: 3500, position: 'top-right' }
  );
}

export function showErrorToast(message) {
  toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? 'animate-slide-in-right' : 'animate-fade-out'
        } flex items-start gap-3 bg-white rounded-xl shadow-lg border-l-4 border-red-500 px-4 py-3 min-w-[320px] max-w-[420px] pointer-events-auto`}
      >
        <span className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-red-100 text-red-600 text-sm font-bold">
          ✕
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900">{message}</p>
        </div>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 text-sm leading-none cursor-pointer"
        >
          ✕
        </button>
      </div>
    ),
    { duration: 3500, position: 'top-right' }
  );
}
