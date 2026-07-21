import Modal from './Modal';

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
        {label}
      </span>
      <span className="text-sm text-gray-900">
        {value || <span className="text-gray-300 italic">Not provided</span>}
      </span>
    </div>
  );
}

export default function SamajDetailModal({ isOpen, onClose, samaj }) {
  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : '-';

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-8">
        {/* ===== Samaj Information ===== */}
        <div>
          <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <svg
              className="w-5 h-5 text-teal-500"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            Samaj Information
          </h3>

          <div className="backdrop-blur-xl bg-white/80 border border-gray-100 rounded-2xl shadow-sm p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <InfoRow label="Samaj Name" value={samaj.samajName} />
            <InfoRow label="Mobile Number" value={samaj.mobile} />
            <InfoRow label="Email Address" value={samaj.email} />
            <div className="sm:col-span-2 lg:col-span-3">
              <InfoRow label="Office Address" value={samaj.officeAddress} />
            </div>
            <InfoRow label="City" value={samaj.city} />
            <InfoRow label="District" value={samaj.district} />
            <InfoRow label="State" value={samaj.state} />
            <InfoRow label="Pincode" value={samaj.pincode} />
            <div className="sm:col-span-2 lg:col-span-3">
              <InfoRow label="Remarks" value={samaj.remarks} />
            </div>
            <InfoRow
              label="Status"
              value={
                <span
                  className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full ${
                    samaj.isActive
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {samaj.isActive ? 'Active' : 'Inactive'}
                </span>
              }
            />
            <InfoRow label="Created Date" value={formatDate(samaj.createdAt)} />
            <InfoRow label="Last Updated" value={formatDate(samaj.updatedAt)} />
          </div>
        </div>

        {/* ===== Samaj Leaders ===== */}
        <div>
          <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <svg
              className="w-5 h-5 text-teal-500"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            Samaj Leaders
            {samaj.leaders?.length > 0 && (
              <span className="text-xs font-normal text-gray-400 ml-1">
                ({samaj.leaders.length})
              </span>
            )}
          </h3>

          {samaj.leaders && samaj.leaders.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="px-4 py-3">Designation</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Mobile Number</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {samaj.leaders.map((l, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                        {l.designation || '-'}
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                        {l.name || '-'}
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                        {l.mobile || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic text-center py-6 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
              No Leaders Found.
            </p>
          )}
        </div>

      </div>
    </Modal>
  );
}
