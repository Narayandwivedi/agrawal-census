import { useState, useEffect } from 'react';
import { getAllSamaj, deleteSamaj } from '../services/storage';
import { showSuccessToast, showErrorToast } from './ToastContent';
import SamajDetailModal from './SamajDetailModal';
import DeleteConfirmDialog from './DeleteConfirmDialog';

export default function SamajList({ refreshKey, onRefresh, onEditSamaj }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSamaj, setSelectedSamaj] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getAllSamaj()
      .then((data) => {
        if (!cancelled) setList(data);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const openDetail = (samaj) => {
    setSelectedSamaj(samaj);
    setDetailOpen(true);
  };

  const handleDeleteSamaj = async () => {
    try {
      await deleteSamaj(deleteTarget._id);
      showSuccessToast('Samaj deleted successfully.');
      if (onRefresh) onRefresh();
    } catch {
      showErrorToast('Failed to delete Samaj. Please try again.');
      throw new Error('Delete failed');
    }
  };

  if (loading) {
    return (
      <p className="text-gray-400 text-sm text-center py-8">Loading...</p>
    );
  }

  if (list.length === 0) {
    return (
      <p className="text-gray-400 text-sm text-center py-8">
        No Samaj added yet
      </p>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {list.map((samaj) => (
          <div
            key={samaj._id}
            className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:shadow-md hover:border-gray-300 transition-all"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {samaj.samajName}
              </p>
              <p className="text-xs text-gray-500 mt-0.5 truncate">
                {samaj.city && `${samaj.city}, `}
                {samaj.state || ''}
                {samaj.mobile && ` · ${samaj.mobile}`}
                {samaj.leaders?.length > 0 &&
                  ` · ${samaj.leaders.length} leader${samaj.leaders.length !== 1 ? 's' : ''}`}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => openDetail(samaj)}
                title="View"
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>

              <button
                onClick={() => onEditSamaj(samaj)}
                title="Edit"
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>

              <button
                onClick={() => setDeleteTarget(samaj)}
                title="Delete"
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedSamaj && (
        <SamajDetailModal
          isOpen={detailOpen}
          onClose={() => setDetailOpen(false)}
          samaj={selectedSamaj}
        />
      )}

      {deleteTarget && (
        <DeleteConfirmDialog
          isOpen={Boolean(deleteTarget)}
          onClose={() => setDeleteTarget(null)}
          title="Delete Samaj?"
          message="Are you sure you want to delete this Samaj? This action cannot be undone."
          onDelete={handleDeleteSamaj}
        />
      )}
    </>
  );
}
