import { useState, useEffect } from 'react';
import { createFamily, updateFamily } from '../services/storage';
import { showErrorToast } from './ToastContent';
import {
  Users,
  X,
  MapPin,
  MessageSquare,
  UserPlus,
  Trash2,
  CheckCircle,
  Home,
} from 'lucide-react';

const emptyMember = () => ({
  name: '',
  relation: '',
  mobile: '',
  age: '',
  gender: '',
  occupation: '',
});

function buildInitial(editData) {
  if (editData) {
    return {
      leaderName: editData.leaderName || '',
      leaderMobile: editData.leaderMobile || '',
      totalMembers: editData.totalMembers ?? 1,
      address: editData.address || '',
      city: editData.city || '',
      district: editData.district || '',
      state: editData.state || '',
      pincode: editData.pincode || '',
      remarks: editData.remarks || '',
      isActive: editData.isActive ?? true,
      members: (editData.members || []).map((m) => ({
        name: m.name || '',
        relation: m.relation || '',
        mobile: m.mobile || '',
        age: m.age ?? '',
        gender: m.gender || '',
        occupation: m.occupation || '',
      })),
    };
  }
  return {
    leaderName: '',
    leaderMobile: '',
    totalMembers: 1,
    address: '',
    city: '',
    district: '',
    state: '',
    pincode: '',
    remarks: '',
    isActive: true,
    members: [],
  };
}

function SectionCard({ icon: Icon, title, children }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-gray-50 bg-gray-50/50">
        <Icon size={18} className="text-indigo-500" />
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function Input({ label, required, icon: Icon, className, ...props }) {
  return (
    <label className="flex flex-col gap-1.5 font-medium text-sm flex-1 min-w-0">
      <span className="text-gray-600 text-xs font-semibold uppercase tracking-wide">
        {label} {required && <span className="text-red-400">*</span>}
      </span>
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon size={15} className="text-gray-400" />
          </div>
        )}
        <input
          {...props}
          className={`w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none transition-all duration-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 bg-white ${
            Icon ? 'pl-9' : ''
          } ${className || ''}`}
        />
      </div>
    </label>
  );
}

function Textarea({ label, required, ...props }) {
  return (
    <label className="flex flex-col gap-1.5 font-medium text-sm flex-1 min-w-0">
      <span className="text-gray-600 text-xs font-semibold uppercase tracking-wide">
        {label} {required && <span className="text-red-400">*</span>}
      </span>
      <textarea
        {...props}
        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none transition-all duration-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 bg-white resize-y min-h-[70px]"
      />
    </label>
  );
}

function Select({ label, required, children, ...props }) {
  return (
    <label className="flex flex-col gap-1.5 font-medium text-sm flex-1 min-w-0">
      <span className="text-gray-600 text-xs font-semibold uppercase tracking-wide">
        {label} {required && <span className="text-red-400">*</span>}
      </span>
      <select
        {...props}
        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none transition-all duration-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 bg-white"
      >
        {children}
      </select>
    </label>
  );
}

export default function FamilyForm({ editData, onBack, onSuccess }) {
  const [form, setForm] = useState(() => buildInitial(editData));
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const isEditing = Boolean(editData);

  useEffect(() => {
    setForm(buildInitial(editData));
  }, [editData]);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess, onSuccess]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleMemberChange = (index, field, value) => {
    const updated = [...form.members];
    updated[index] = { ...updated[index], [field]: value };
    setForm((prev) => ({ ...prev, members: updated }));
  };

  const addMember = () => {
    setForm((prev) => ({ ...prev, members: [...prev.members, emptyMember()] }));
  };

  const removeMember = (index) => {
    setForm((prev) => ({
      ...prev,
      members: prev.members.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        totalMembers: Number(form.totalMembers),
        members: form.members.map((m) => ({
          ...m,
          age: m.age ? Number(m.age) : undefined,
        })),
      };
      if (isEditing) {
        await updateFamily(editData._id, payload);
      } else {
        await createFamily(payload);
      }
      setShowSuccess(true);
    } catch (err) {
      showErrorToast(
        isEditing
          ? 'Failed to update family. Please try again.'
          : 'Failed to save family. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-200">
            <CheckCircle size={44} className="text-white" />
          </div>
          <div className="absolute inset-0 w-20 h-20 rounded-full bg-emerald-400/20 animate-ping" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mt-6">
          {isEditing ? 'Family Updated Successfully!' : 'Family Saved Successfully!'}
        </h3>
        <p className="text-sm text-gray-500 mt-2 text-center max-w-xs">
          {isEditing
            ? 'The family details have been updated successfully.'
            : 'The family details have been saved successfully.'}
        </p>
        <div className="mt-8 flex items-center gap-2 text-xs text-gray-400">
          <div className="w-4 h-4 border-2 border-gray-300 border-t-indigo-500 rounded-full animate-spin" />
          Closing automatically...
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <div className="sticky top-0 z-10 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 px-6 sm:px-8 py-5 rounded-t-2xl">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-sm">
              <Users size={22} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {isEditing ? 'Edit Family' : 'Add New Family'}
              </h2>
              <p className="text-sm text-indigo-200 mt-0.5">
                Enter the family information below
              </p>
            </div>
          </div>
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-white/80 hover:bg-white/25 hover:text-white transition-all duration-200 cursor-pointer backdrop-blur-sm"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="p-6 sm:p-8 flex flex-col gap-5">
        <SectionCard icon={Home} title="Family Information">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                label="Family Leader Name"
                required
                value={form.leaderName}
                onChange={handleChange}
                name="leaderName"
                placeholder="Enter leader name"
              />
              <Input
                label="Leader Mobile"
                value={form.leaderMobile}
                onChange={handleChange}
                name="leaderMobile"
                placeholder="Enter mobile number"
              />
              <Input
                label="Total Members"
                type="number"
                min="1"
                value={form.totalMembers}
                onChange={handleChange}
                name="totalMembers"
                className="max-w-[120px]"
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard icon={MapPin} title="Address Details">
          <div className="flex flex-col gap-4">
            <Textarea
              label="Address"
              value={form.address}
              onChange={handleChange}
              name="address"
              placeholder="Enter full address"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="City"
                value={form.city}
                onChange={handleChange}
                name="city"
                placeholder="Enter city"
              />
              <Input
                label="District"
                value={form.district}
                onChange={handleChange}
                name="district"
                placeholder="Enter district"
              />
              <Input
                label="State"
                value={form.state}
                onChange={handleChange}
                name="state"
                placeholder="Enter state"
              />
              <Input
                label="Pincode"
                value={form.pincode}
                onChange={handleChange}
                name="pincode"
                placeholder="Enter pincode"
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard icon={Users} title="Family Members">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500">
                {form.members.length} member{form.members.length !== 1 ? 's' : ''} added
              </p>
              <button
                type="button"
                onClick={addMember}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-all duration-200 cursor-pointer"
              >
                <UserPlus size={14} />
                Add Member
              </button>
            </div>

            {form.members.length === 0 && (
              <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
                <Users size={32} className="mx-auto text-gray-300" />
                <p className="text-sm text-gray-400 mt-2">No members added yet</p>
                <button
                  type="button"
                  onClick={addMember}
                  className="mt-2 text-xs text-indigo-500 hover:text-indigo-600 font-semibold cursor-pointer"
                >
                  + Add a member
                </button>
              </div>
            )}

            {form.members.map((member, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden transition-all duration-200 hover:border-gray-300 hover:shadow-sm"
              >
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50/80 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="text-xs font-bold text-indigo-600">
                        {idx + 1}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-gray-700">
                      Member {idx + 1}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeMember(idx)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold text-red-500 hover:bg-red-50 transition-all duration-200 cursor-pointer"
                  >
                    <Trash2 size={13} />
                    Remove
                  </button>
                </div>
                <div className="p-4 flex flex-col gap-3">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Input
                      label="Name"
                      required
                      value={member.name}
                      onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                      placeholder="Enter name"
                    />
                    <Input
                      label="Relation with Leader"
                      required
                      value={member.relation}
                      onChange={(e) => handleMemberChange(idx, 'relation', e.target.value)}
                      placeholder="Enter relation"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Input
                      label="Mobile"
                      value={member.mobile}
                      onChange={(e) => handleMemberChange(idx, 'mobile', e.target.value)}
                      placeholder="Enter mobile"
                    />
                    <Input
                      label="Age"
                      type="number"
                      min="0"
                      value={member.age}
                      onChange={(e) => handleMemberChange(idx, 'age', e.target.value)}
                      placeholder="Enter age"
                    />
                    <Select
                      label="Gender"
                      required
                      value={member.gender}
                      onChange={(e) => handleMemberChange(idx, 'gender', e.target.value)}
                    >
                      <option value="">-- Select --</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </Select>
                  </div>
                  <Input
                    label="Occupation"
                    value={member.occupation}
                    onChange={(e) => handleMemberChange(idx, 'occupation', e.target.value)}
                    placeholder="Enter occupation"
                  />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard icon={MessageSquare} title="Remarks">
          <div className="flex flex-col gap-4">
            <Textarea
              label="Additional Notes"
              value={form.remarks}
              onChange={handleChange}
              name="remarks"
              placeholder="Enter any additional remarks or notes..."
            />
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <div className={`relative w-10 h-5 rounded-full transition-all duration-200 ${form.isActive ? 'bg-indigo-500' : 'bg-gray-300'}`}>
                <div
                  className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200 ${
                    form.isActive ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
                <input
                  name="isActive"
                  type="checkbox"
                  checked={form.isActive}
                  onChange={handleChange}
                  className="sr-only"
                />
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                Active
              </span>
            </label>
          </div>
        </SectionCard>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              disabled={submitting}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-100 disabled:opacity-50 transition-all duration-200 cursor-pointer"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-60 transition-all duration-200 shadow-sm shadow-indigo-200 hover:shadow-md hover:shadow-indigo-300 cursor-pointer flex items-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : isEditing ? (
              'Update Family'
            ) : (
              'Save Family'
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
