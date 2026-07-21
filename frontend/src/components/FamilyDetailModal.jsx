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

export default function FamilyDetailModal({ isOpen, onClose, family }) {
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
        {/* ===== Family Information ===== */}
        <div>
          <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <svg
              className="w-5 h-5 text-indigo-500"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"
              />
              <circle cx="9" cy="7" r="4" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
              />
            </svg>
            Family Information
          </h3>

          <div className="backdrop-blur-xl bg-white/80 border border-gray-100 rounded-2xl shadow-sm p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <InfoRow label="Family Leader Name" value={family.leaderName} />
            <InfoRow label="Leader Mobile" value={family.leaderMobile} />
            <InfoRow label="Total Members" value={family.totalMembers ?? '-'} />
            <div className="sm:col-span-2 lg:col-span-3">
              <InfoRow label="Address" value={family.address} />
            </div>
            <InfoRow label="City" value={family.city} />
            <InfoRow label="District" value={family.district} />
            <InfoRow label="State" value={family.state} />
            <InfoRow label="Pincode" value={family.pincode} />
            <div className="sm:col-span-2 lg:col-span-3">
              <InfoRow label="Remarks" value={family.remarks} />
            </div>
            <InfoRow
              label="Status"
              value={
                <span
                  className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full ${
                    family.isActive
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {family.isActive ? 'Active' : 'Inactive'}
                </span>
              }
            />
            <InfoRow label="Created Date" value={formatDate(family.createdAt)} />
            <InfoRow label="Last Updated" value={formatDate(family.updatedAt)} />
          </div>
        </div>

        {/* ===== Family Members ===== */}
        <div>
          <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <svg
              className="w-5 h-5 text-indigo-500"
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
            Family Members
            {family.members?.length > 0 && (
              <span className="text-xs font-normal text-gray-400 ml-1">
                ({family.members.length})
              </span>
            )}
          </h3>

          {family.members && family.members.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Relation</th>
                    <th className="px-4 py-3">Mobile</th>
                    <th className="px-4 py-3 text-center">Age</th>
                    <th className="px-4 py-3">Gender</th>
                    <th className="px-4 py-3">Occupation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {family.members.map((m, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                        {m.name}
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                        {m.relation}
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                        {m.mobile || '-'}
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-center whitespace-nowrap">
                        {m.age != null ? m.age : '-'}
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap capitalize">
                        {m.gender?.toLowerCase() || '-'}
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                        {m.occupation || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic text-center py-6 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
              No Family Members Found
            </p>
          )}
        </div>

        {/* ===== Close Button ===== */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
