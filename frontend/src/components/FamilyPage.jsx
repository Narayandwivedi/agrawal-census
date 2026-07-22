import { useState } from 'react';
import { createFamily } from '../services/storage';
import { showSuccessToast, showErrorToast } from './ToastContent';
import { Users, UserPlus, Trash2, MessageSquare } from 'lucide-react';

const RELATION_OPTIONS = [
  'Self', 'Husband', 'Wife', 'Son', 'Daughter', 'Father', 'Mother',
  'Brother', 'Sister', 'Grandfather', 'Grandmother', 'Uncle', 'Aunt', 'Other'
];

const emptyMember = () => ({
  name: '',
  relation: '',
  mobile: '',
  age: '',
  gender: '',
  occupation: '',
});

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman & Nicobar', 'Chandigarh', 'Dadra & Nagar Haveli',
  'Daman & Diu', 'Delhi', 'Jammu & Kashmir', 'Ladakh',
  'Lakshadweep', 'Puducherry',
];

function Input({ label, required, error, className, ...props }) {
  return (
    <label className="flex flex-col gap-1.5 font-medium text-sm flex-1 min-w-0">
      <span className="text-gray-700 text-sm font-semibold">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <input
        {...props}
        className={`w-full px-3.5 py-2.5 border ${error ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : 'border-gray-200 focus:border-[#C67A2D] focus:ring-[#C67A2D]/15'} rounded-xl text-sm outline-none transition-all duration-200 focus:ring-2 bg-white ${className || ''}`}
      />
      {error && <span className="text-xs text-red-500 mt-0.5">{error}</span>}
    </label>
  );
}

function Textarea({ label, required, error, ...props }) {
  return (
    <label className="flex flex-col gap-1.5 font-medium text-sm flex-1 min-w-0">
      <span className="text-gray-700 text-sm font-semibold">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <textarea
        {...props}
        className={`w-full px-3.5 py-2.5 border ${error ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : 'border-gray-200 focus:border-[#C67A2D] focus:ring-[#C67A2D]/15'} rounded-xl text-sm outline-none transition-all duration-200 focus:ring-2 bg-white resize-y min-h-[80px]`}
      />
      {error && <span className="text-xs text-red-500 mt-0.5">{error}</span>}
    </label>
  );
}

function Select({ label, required, error, children, ...props }) {
  return (
    <label className="flex flex-col gap-1.5 font-medium text-sm flex-1 min-w-0">
      <span className="text-gray-700 text-sm font-semibold">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <select
        {...props}
        className={`w-full px-3.5 py-2.5 border ${error ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : 'border-gray-200 focus:border-[#C67A2D] focus:ring-[#C67A2D]/15'} rounded-xl text-sm outline-none transition-all duration-200 focus:ring-2 bg-white`}
      >
        {children}
      </select>
      {error && <span className="text-xs text-red-500 mt-0.5">{error}</span>}
    </label>
  );
}

function SectionCard({ title, children }) {
  return (
    <div className="bg-white rounded-[20px] border border-gray-100 shadow-lg shadow-gray-200/50 overflow-hidden">
      <div className="px-6 sm:px-8 py-4 border-b border-gray-100 bg-gradient-to-r from-[#FFF8F0] to-white">
        <h3 className="text-base font-bold text-[#C67A2D] tracking-wide">{title}</h3>
      </div>
      <div className="p-6 sm:p-8">{children}</div>
    </div>
  );
}

function generateFamilyId() {
  const num = Math.floor(10000 + Math.random() * 90000);
  return `FAM-${num}`;
}

function getTodayDate() {
  return new Date().toISOString().split('T')[0];
}

export default function FamilyPage() {
  const [form, setForm] = useState({
    familyName: '',
    samajName: '',
    familyId: generateFamilyId(),
    headOfFamily: '',
    mobile: '',
    email: '',
    address: '',
    state: '',
    district: '',
    city: '',
    pincode: '',
    numberOfMembers: '1',
    registrationDate: getTodayDate(),
    remarks: '',
    gotra: '',
    kulVansh: '',
    otherInfo: '',
    members: [],
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
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

  const validate = () => {
    const errs = {};
    if (!form.familyName.trim()) errs.familyName = 'Family Name Is Required';
    if (!form.samajName.trim()) errs.samajName = 'Samaj Name Is Required';
    if (!form.headOfFamily.trim()) errs.headOfFamily = 'Head Of Family Is Required';
    if (!form.mobile.trim()) errs.mobile = 'Mobile Number Is Required';
    if (!form.address.trim()) errs.address = 'Address Is Required';
    if (!form.state) errs.state = 'State Is Required';
    if (!form.district.trim()) errs.district = 'District Is Required';
    if (!form.city.trim()) errs.city = 'City Is Required';
    if (!form.pincode.trim()) errs.pincode = 'Pincode Is Required';
    if (!form.numberOfMembers || Number(form.numberOfMembers) < 1) errs.numberOfMembers = 'At Least 1 Member Required';
    if (!form.registrationDate) errs.registrationDate = 'Registration Date Is Required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    try {
      await createFamily({
        familyName: form.familyName,
        samajName: form.samajName,
        familyId: form.familyId,
        headOfFamily: form.headOfFamily,
        mobile: form.mobile,
        email: form.email,
        address: form.address,
        state: form.state,
        district: form.district,
        city: form.city,
        pincode: form.pincode,
        numberOfMembers: Number(form.numberOfMembers),
        registrationDate: form.registrationDate,
        remarks: form.remarks,
        gotra: form.gotra,
        kulVansh: form.kulVansh,
        otherInfo: form.otherInfo,
        members: form.members.map((m) => ({
          ...m,
          age: m.age ? Number(m.age) : '',
        })),
        isActive: true,
      });
      showSuccessToast('Family Registered Successfully!');
      setForm({
        familyName: '',
        samajName: '',
        familyId: generateFamilyId(),
        headOfFamily: '',
        mobile: '',
        email: '',
        address: '',
        state: '',
        district: '',
        city: '',
        pincode: '',
        numberOfMembers: '1',
        registrationDate: getTodayDate(),
        remarks: '',
        gotra: '',
        kulVansh: '',
        otherInfo: '',
        members: [],
      });
    } catch (err) {
      showErrorToast('Failed To Save Family. Please Try Again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setForm({
      familyName: '',
      samajName: '',
      familyId: generateFamilyId(),
      headOfFamily: '',
      mobile: '',
      email: '',
      address: '',
      state: '',
      district: '',
      city: '',
      pincode: '',
      numberOfMembers: '1',
      registrationDate: getTodayDate(),
      remarks: '',
      gotra: '',
      kulVansh: '',
      otherInfo: '',
      members: [],
    });
    setErrors({});
  };

  const today = getTodayDate();

  return (
    <div className="bg-[#FFF8F0] min-h-screen px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-12 pt-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#4A3520] leading-tight">
            Agrawal Samaj Census Portal
          </h1>
          <div className="mx-auto mt-4 w-20 h-1 rounded-full bg-gradient-to-r from-[#C67A2D] to-[#A8651E]" />
          <p className="mt-6 text-base sm:text-lg text-gray-500 max-w-3xl mx-auto leading-relaxed">
            Register and manage family records in a secure, centralized, and user-friendly census management system. Keep community information organized, accurate, and easily accessible.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <SectionCard title="Family Information">
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <Input
                  label="Family Name"
                  required
                  error={errors.familyName}
                  value={form.familyName}
                  onChange={(e) => handleChange('familyName', e.target.value)}
                  placeholder="Enter Family Name"
                />
                <Input
                  label="Samaj Name"
                  required
                  error={errors.samajName}
                  value={form.samajName}
                  onChange={(e) => handleChange('samajName', e.target.value)}
                  placeholder="Enter Samaj Name"
                />
                <Input
                  label="Family ID"
                  value={form.familyId}
                  readOnly
                  className="bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <Input
                  label="Head Of Family"
                  required
                  error={errors.headOfFamily}
                  value={form.headOfFamily}
                  onChange={(e) => handleChange('headOfFamily', e.target.value)}
                  placeholder="Enter Head Of Family Name"
                />
                <Input
                  label="Mobile Number"
                  required
                  error={errors.mobile}
                  type="tel"
                  value={form.mobile}
                  onChange={(e) => handleChange('mobile', e.target.value)}
                  placeholder="Enter Mobile Number"
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="Enter Email Address"
                />
              </div>

              <Textarea
                label="Complete Address"
                required
                error={errors.address}
                value={form.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="Enter Complete Address"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <Select
                  label="State"
                  required
                  error={errors.state}
                  value={form.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                >
                  <option value="">-- Select State --</option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </Select>
                <Input
                  label="District"
                  required
                  error={errors.district}
                  value={form.district}
                  onChange={(e) => handleChange('district', e.target.value)}
                  placeholder="Enter District"
                />
                <Input
                  label="City"
                  required
                  error={errors.city}
                  value={form.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  placeholder="Enter City"
                />
                <Input
                  label="Pincode"
                  required
                  error={errors.pincode}
                  value={form.pincode}
                  onChange={(e) => handleChange('pincode', e.target.value)}
                  placeholder="Enter Pincode"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <Input
                  label="Number Of Members"
                  required
                  error={errors.numberOfMembers}
                  type="number"
                  min="1"
                  value={form.numberOfMembers}
                  onChange={(e) => handleChange('numberOfMembers', e.target.value)}
                  placeholder="Enter Number Of Members"
                />
                <Input
                  label="Registration Date"
                  required
                  error={errors.registrationDate}
                  type="date"
                  value={form.registrationDate || today}
                  onChange={(e) => handleChange('registrationDate', e.target.value)}
                />
                <Input
                  label="Remarks"
                  value={form.remarks}
                  onChange={(e) => handleChange('remarks', e.target.value)}
                  placeholder="Any Remarks (Optional)"
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Additional Information">
            <p className="text-xs text-gray-400 mb-5">All Fields In This Section Are Optional.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <Input
                label="Gotra"
                value={form.gotra}
                onChange={(e) => handleChange('gotra', e.target.value)}
                placeholder="Enter Gotra (Optional)"
              />
              <Input
                label="Kul / Vansh"
                value={form.kulVansh}
                onChange={(e) => handleChange('kulVansh', e.target.value)}
                placeholder="Enter Kul Or Vansh (Optional)"
              />
              <Input
                label="Any Other Information"
                value={form.otherInfo}
                onChange={(e) => handleChange('otherInfo', e.target.value)}
                placeholder="Enter Any Other Info (Optional)"
              />
            </div>
          </SectionCard>

          <SectionCard title="Family Members">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  {form.members.length} member{form.members.length !== 1 ? 's' : ''} added
                </span>
                <button
                  type="button"
                  onClick={addMember}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-[#C67A2D] to-[#A8651E] text-white hover:opacity-90 transition-all duration-200 cursor-pointer shadow-sm shadow-[#C67A2D]/20"
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
                    className="mt-2 text-xs text-[#C67A2D] hover:text-[#A8651E] font-semibold cursor-pointer"
                  >
                    + Add a member
                  </button>
                </div>
              )}

              {form.members.map((member, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 hover:border-gray-300 hover:shadow-sm animate-fade-in"
                >
                  <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-[#FFF8F0] to-white border-b border-gray-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#C67A2D] to-[#A8651E] flex items-center justify-center shadow-sm">
                        <span className="text-xs font-bold text-white">{idx + 1}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-700">
                        Member {idx + 1}
                      </span>
                    </div>
                    {form.members.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMember(idx)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 cursor-pointer"
                      >
                        <Trash2 size={13} />
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="p-5 flex flex-col gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Member Name"
                        value={member.name}
                        onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                        placeholder="Enter member name"
                      />
                      <Select
                        label="Relation"
                        value={member.relation}
                        onChange={(e) => handleMemberChange(idx, 'relation', e.target.value)}
                      >
                        <option value="">-- Select Relation --</option>
                        {RELATION_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </Select>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Input
                        label="Mobile Number"
                        type="tel"
                        value={member.mobile}
                        onChange={(e) => handleMemberChange(idx, 'mobile', e.target.value)}
                        placeholder="Enter mobile number"
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
                        value={member.gender}
                        onChange={(e) => handleMemberChange(idx, 'gender', e.target.value)}
                      >
                        <option value="">-- Select Gender --</option>
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

          <SectionCard title="Remarks & Status">
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 gap-5">
                <Textarea
                  label="Remarks"
                  value={form.remarks}
                  onChange={(e) => handleChange('remarks', e.target.value)}
                  placeholder="Enter any additional remarks or notes..."
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="relative w-11 h-6 rounded-full bg-[#C67A2D] transition-all duration-200">
                  <div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-200 translate-x-[22px]" />
                  <input
                    name="isActive"
                    type="checkbox"
                    checked={true}
                    readOnly
                    className="sr-only"
                  />
                </div>
                <span className="text-sm font-medium text-gray-700">Active Status</span>
              </div>
            </div>
          </SectionCard>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 pb-8">
            <button
              type="button"
              onClick={handleReset}
              className="w-full sm:w-auto px-8 py-3.5 rounded-[14px] text-sm font-semibold text-gray-500 bg-white border-2 border-gray-200 hover:bg-gray-50 hover:text-gray-700 hover:border-gray-300 transition-all duration-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-10 py-3.5 rounded-[14px] text-sm font-semibold text-white bg-gradient-to-r from-[#C67A2D] to-[#A8651E] shadow-lg shadow-[#C67A2D]/20 hover:shadow-xl hover:shadow-[#C67A2D]/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:hover:translate-y-0 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Family'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
