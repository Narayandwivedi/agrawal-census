import { useState } from 'react';

export default function DeleteConfirmDialog({
  isOpen,
  onClose,
  title,
  message,
  onDelete,
}) {
  const [deleting, setDeleting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDelete();
      setShowSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch {
      setDeleting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm">
          <div className="flex flex-col items-center py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-3xl animate-success-pop">
              &#x2705;
            </div>
            <h3 className="text-xl font-bold text-gray-900 mt-5 animate-success-pop">
              Deleted Successfully!
            </h3>
            <p className="text-sm text-gray-500 mt-2 text-center animate-success-pop">
              The record has been deleted permanently.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-all duration-300"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-sm transition-all duration-300 animate-success-pop"
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center text-2xl mb-4">
            &#x1f5d1;
          </div>
          <h3 className="text-xl font-bold text-gray-900">{title || 'Delete?'}</h3>
          <p className="text-sm text-gray-500 mt-2 max-w-xs">
            {message || 'Are you sure?'}
          </p>

          <div className="flex gap-3 mt-8 w-full max-w-xs">
            <button
              onClick={onClose}
              disabled={deleting}
              className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-60 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-700 disabled:opacity-60 transition-colors cursor-pointer"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
