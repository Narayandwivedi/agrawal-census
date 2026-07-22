import { useState, useRef, useCallback } from 'react';
import { createSamaj } from '../services/storage';
import { showSuccessToast, showErrorToast } from './ToastContent';
import HeroSection from './HeroSection';

const emptyForm = {
  samajName: '',
  officeAddress: '',
  mobile: '',
  email: '',
  state: '',
  district: '',
  city: '',
  pincode: '',
  contactPersonName: '',
  designation: '',
  contactPersonMobile: '',
  contactPersonEmail: '',
  alternateMobile: '',
  registrationNumber: '',
  establishmentYear: '',
  website: '',
  remarks: '',
  documents: [],
};

function Input({ label, required, className, ...props }) {
  return (
    <label className="flex flex-col gap-1.5 font-medium text-sm flex-1 min-w-0">
      <span className="text-gray-700 text-sm font-semibold">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <input
        {...props}
        className={`w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm outline-none transition-all duration-200 focus:border-[#C67A2D] focus:ring-2 focus:ring-[#C67A2D]/15 bg-white ${className || ''}`}
      />
    </label>
  );
}

function Textarea({ label, required, ...props }) {
  return (
    <label className="flex flex-col gap-1.5 font-medium text-sm flex-1 min-w-0">
      <span className="text-gray-700 text-sm font-semibold">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <textarea
        {...props}
        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm outline-none transition-all duration-200 focus:border-[#C67A2D] focus:ring-2 focus:ring-[#C67A2D]/15 bg-white resize-y min-h-[80px]"
      />
    </label>
  );
}

function Select({ label, required, children, ...props }) {
  return (
    <label className="flex flex-col gap-1.5 font-medium text-sm flex-1 min-w-0">
      <span className="text-gray-700 text-sm font-semibold">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <select
        {...props}
        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm outline-none transition-all duration-200 focus:border-[#C67A2D] focus:ring-2 focus:ring-[#C67A2D]/15 bg-white"
      >
        {children}
      </select>
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

function SectionHeader({ icon, title }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-8 h-8 rounded-lg bg-[#C67A2D]/10 flex items-center justify-center">
        <span className="text-[#C67A2D] text-base">{icon}</span>
      </div>
      <h2 className="text-lg font-bold text-[#4A3520]">{title}</h2>
    </div>
  );
}

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

export default function AddSamajPage() {
  const [form, setForm] = useState({ ...emptyForm });
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setForm({ ...emptyForm });
  };

  const handleFileSelect = useCallback((files) => {
    const validFiles = Array.from(files).filter((f) => {
      const ext = f.name.split('.').pop().toLowerCase();
      return ['jpg', 'jpeg', 'png', 'pdf'].includes(ext) && f.size <= 5 * 1024 * 1024;
    });
    if (validFiles.length > 0) {
      setForm((prev) => ({
        ...prev,
        documents: [...prev.documents, ...validFiles.map((f) => f.name)],
      }));
      showSuccessToast(`${validFiles.length} file(s) added`);
    }
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragOver(false);
      handleFileSelect(e.dataTransfer.files);
    },
    [handleFileSelect]
  );

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleFileInputChange = (e) => {
    handleFileSelect(e.target.files);
    e.target.value = '';
  };

  const removeDocument = (idx) => {
    setForm((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.samajName.trim()) {
      showErrorToast('Samaj Name Is Required.');
      return;
    }
    if (!form.officeAddress.trim()) {
      showErrorToast('Office Address Is Required.');
      return;
    }
    if (!form.mobile.trim()) {
      showErrorToast('Mobile Number Is Required.');
      return;
    }
    if (!form.state.trim()) {
      showErrorToast('State Is Required.');
      return;
    }
    if (!form.district.trim()) {
      showErrorToast('District Is Required.');
      return;
    }
    if (!form.city.trim()) {
      showErrorToast('City Is Required.');
      return;
    }
    if (!form.contactPersonName.trim()) {
      showErrorToast('Contact Person Name is required.');
      return;
    }
    if (!form.designation.trim()) {
      showErrorToast('Designation Is Required.');
      return;
    }
    if (!form.contactPersonMobile.trim()) {
      showErrorToast('Contact Person Mobile Number is required.');
      return;
    }

    setSubmitting(true);
    try {
      await createSamaj({
        samajName: form.samajName,
        officeAddress: form.officeAddress,
        mobile: form.mobile,
        email: form.email,
        state: form.state,
        district: form.district,
        city: form.city,
        pincode: form.pincode,
        contactPersonName: form.contactPersonName,
        designation: form.designation,
        contactPersonMobile: form.contactPersonMobile,
        contactPersonEmail: form.contactPersonEmail,
        alternateMobile: form.alternateMobile,
        registrationNumber: form.registrationNumber,
        establishmentYear: form.establishmentYear,
        website: form.website,
        remarks: form.remarks,
        documents: form.documents,
        leaders: [],
        isActive: true,
      });
      setShowSuccess(true);
      showSuccessToast('Samaj Registered Successfully!');
    } catch (err) {
      showErrorToast('Failed To Save Samaj. Please Try Again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <>
        <HeroSection />
        <div className="bg-[#FFF8F0] min-h-[60vh] flex items-center justify-center px-4">
          <div className="bg-white rounded-[20px] shadow-lg shadow-gray-200/50 p-12 max-w-md w-full text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#C67A2D] to-[#A8651E] flex items-center justify-center mx-auto shadow-lg shadow-[#C67A2D]/30">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#4A3520] mt-6">Samaj Registered Successfully!</h3>
            <p className="text-sm text-gray-500 mt-2">The Samaj Information Has Been Saved Successfully.</p>
            <button
              onClick={() => { setShowSuccess(false); setForm({ ...emptyForm }); }}
              className="mt-8 px-8 py-3 rounded-[14px] text-sm font-semibold text-white bg-gradient-to-r from-[#C67A2D] to-[#A8651E] hover:shadow-lg hover:shadow-[#C67A2D]/25 transition-all duration-300 cursor-pointer"
            >
              Register Another Samaj
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <HeroSection />
      <div className="bg-[#FFF8F0] px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#4A3520]">Register New Samaj</h1>
            <p className="text-sm sm:text-base text-gray-500 mt-2">
              Fill In The Details Below To Register A New Samaj In The Census Portal.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            {/* Section 1: Samaj Information */}
            <div>
              <SectionHeader icon="🏛️" title="Samaj Information" />
              <SectionCard title="Basic Details">
                <div className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Input
                      label="Samaj Name"
                      required
                      value={form.samajName}
                      onChange={handleChange}
                      name="samajName"
                      placeholder="Enter Samaj Name"
                    />
                    <Input
                      label="Samaj Mobile Number"
                      required
                      value={form.mobile}
                      onChange={handleChange}
                      name="mobile"
                      placeholder="Enter Mobile Number"
                    />
                  </div>
                  <Textarea
                    label="Samaj Office Address"
                    required
                    value={form.officeAddress}
                    onChange={handleChange}
                    name="officeAddress"
                      placeholder="Enter Office Address"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Input
                      label="Samaj Email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      name="email"
                      placeholder="Enter Email Address"
                    />

                  </div>
                </div>
              </SectionCard>

              <div className="mt-5">
                <SectionCard title="Location Details">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Select
                      label="State"
                      required
                      value={form.state}
                      onChange={handleChange}
                      name="state"
                    >
                      <option value="">-- Select State --</option>
                      {INDIAN_STATES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </Select>
                    <Input
                      label="District"
                      required
                      value={form.district}
                      onChange={handleChange}
                      name="district"
                      placeholder="Enter District"
                    />
                    <Input
                      label="City"
                      required
                      value={form.city}
                      onChange={handleChange}
                      name="city"
                      placeholder="Enter City"
                    />
                    <Input
                      label="Pincode"
                      value={form.pincode}
                      onChange={handleChange}
                      name="pincode"
                      placeholder="Enter Pincode (Optional)"
                    />
                  </div>
                </SectionCard>
              </div>
            </div>

            {/* Section 2: Samaj Head / Contact Person */}
            <div>
              <SectionHeader icon="👤" title="Samaj Head / Contact Person" />
              <SectionCard title="Contact Person Details">
                <div className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Input
                      label="Contact Person Name"
                      required
                      value={form.contactPersonName}
                      onChange={handleChange}
                      name="contactPersonName"
                      placeholder="Enter Contact Person Name"
                    />
                    <Input
                      label="Designation"
                      required
                      value={form.designation}
                      onChange={handleChange}
                      name="designation"
                      placeholder="Enter Designation"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Input
                      label="Mobile Number"
                      required
                      value={form.contactPersonMobile}
                      onChange={handleChange}
                      name="contactPersonMobile"
                      placeholder="Enter Mobile Number"
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      value={form.contactPersonEmail}
                      onChange={handleChange}
                      name="contactPersonEmail"
                      placeholder="Enter Email Address"
                    />
                  </div>
                  <Input
                    label="Alternate Mobile"
                    value={form.alternateMobile}
                    onChange={handleChange}
                    name="alternateMobile"
                    placeholder="Enter Alternate Mobile (Optional)"
                    className="max-w-md"
                  />
                </div>
              </SectionCard>
            </div>

            {/* Section 3: Additional Information */}
            <div>
              <SectionHeader icon="📋" title="Additional Information" />
              <SectionCard title="Other Details">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  <Input
                    label="Registration Number"
                    value={form.registrationNumber}
                    onChange={handleChange}
                    name="registrationNumber"
                    placeholder="Enter Registration Number"
                  />
                  <Input
                    label="Establishment Year"
                    type="number"
                    min="1000"
                    max="2099"
                    value={form.establishmentYear}
                    onChange={handleChange}
                    name="establishmentYear"
                    placeholder="e.g. 1980"
                  />
                  <Input
                    label="Samaj Website"
                    type="url"
                    value={form.website}
                    onChange={handleChange}
                    name="website"
                    placeholder="https://example.com"
                  />
                </div>
              </SectionCard>

              <div className="mt-5">
                <SectionCard title="Remarks">
                  <Textarea
                    label="Remarks"
                    value={form.remarks}
                    onChange={handleChange}
                    name="remarks"
                    placeholder="Enter Any Additional Remarks Or Notes..."
                  />
                </SectionCard>
              </div>
            </div>

            {/* Section 4: Documents */}
            <div>
              <SectionHeader icon="📎" title="Documents (Optional)" />
              <SectionCard title="Upload Documents">
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 ${
                    dragOver
                      ? 'border-[#C67A2D] bg-[#C67A2D]/5'
                      : 'border-gray-200 hover:border-[#C67A2D]/40 hover:bg-gray-50'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                  <div className="text-4xl mb-4">📤</div>
                  <p className="text-sm font-semibold text-gray-700">
                    Drag & Drop Files Here Or <span className="text-[#C67A2D] underline decoration-dashed underline-offset-2">Click To Upload</span>
                  </p>
                  <div className="flex items-center justify-center gap-4 mt-3 text-xs text-gray-400">
                    <span>Allowed: JPG, PNG, PDF</span>
                    <span className="w-px h-3 bg-gray-300" />
                    <span>Max Size: 5 MB</span>
                  </div>
                </div>

                {form.documents.length > 0 && (
                  <div className="mt-5 space-y-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Uploaded Files ({form.documents.length})
                    </p>
                    {form.documents.map((doc, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-100"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <svg className="w-4 h-4 flex-shrink-0 text-[#C67A2D]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                          </svg>
                          <span className="text-sm text-gray-700 truncate">{doc}</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); removeDocument(idx); }}
                          className="flex-shrink-0 w-6 h-6 rounded-full hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </SectionCard>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 pb-8">
              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto px-8 py-3.5 rounded-[14px] text-sm font-semibold text-gray-500 bg-white border-2 border-gray-200 hover:bg-gray-50 hover:text-gray-700 hover:border-gray-300 transition-all duration-200 cursor-pointer"
              >
                Reset Form
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
                  'Save Samaj'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
