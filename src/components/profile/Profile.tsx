import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, Mail, Lock, Edit3, Save, X, CheckCircle, AlertCircle } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password && formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    const updates: Record<string, string> = {};
    if (formData.name !== user?.name) updates.name = formData.name;
    if (formData.email !== user?.email) updates.email = formData.email;
    if (formData.password) updates.password = formData.password;

    if (Object.keys(updates).length > 0) {
      updateUser(updates);
      setSuccess('Profile updated successfully!');
    }

    setIsEditing(false);
    setFormData((prev) => ({ ...prev, password: '', confirmPassword: '' }));
  };

  if (!user) return null;

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header card */}
      <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-8 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-2xl font-bold text-slate-900 shadow-xl shadow-amber-500/20 flex-shrink-0">
          {initials}
        </div>
        <div className="text-center sm:text-left">
          <h1 className="text-2xl font-bold text-white">{user.name}</h1>
          <p className="text-slate-400 mt-0.5">{user.email}</p>
          <span className="inline-block mt-2 text-xs font-medium bg-amber-500/20 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full">
            Member
          </span>
        </div>
      </div>

      {/* Success / Error banners */}
      {success && (
        <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-5 py-3.5">
          <CheckCircle size={16} className="text-emerald-400 shrink-0" />
          <p className="text-sm text-emerald-400">{success}</p>
        </div>
      )}
      {error && (
        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-5 py-3.5">
          <AlertCircle size={16} className="text-red-400 shrink-0" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Details / Edit form */}
      <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">Account Details</h2>
          {!isEditing && (
            <button
              onClick={() => { setIsEditing(true); setSuccess(''); }}
              className="flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 border border-amber-500/20 hover:border-amber-400/40 hover:bg-amber-500/10 px-4 py-2 rounded-xl font-medium transition-all duration-200"
            >
              <Edit3 size={14} />
              Edit
            </button>
          )}
        </div>

        {!isEditing ? (
          <div className="space-y-4">
            {[
              { label: 'Full Name', value: user.name, icon: User },
              { label: 'Email Address', value: user.email, icon: Mail },
              { label: 'Password', value: '••••••••', icon: Lock },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex items-center gap-4 p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl">
                <div className="w-9 h-9 bg-slate-700 rounded-lg flex items-center justify-center text-slate-400 flex-shrink-0">
                  <Icon size={16} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">{label}</p>
                  <p className="text-sm font-medium text-slate-200">{value}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: 'Full Name', name: 'name', type: 'text', value: formData.name, icon: User, placeholder: 'Your full name' },
              { label: 'Email Address', name: 'email', type: 'email', value: formData.email, icon: Mail, placeholder: 'your@email.com' },
              { label: 'New Password', name: 'password', type: 'password', value: formData.password, icon: Lock, placeholder: 'Leave blank to keep current' },
              { label: 'Confirm New Password', name: 'confirmPassword', type: 'password', value: formData.confirmPassword, icon: Lock, placeholder: '••••••••' },
            ].map(({ label, name, type, value, icon: Icon, placeholder }) => (
              <div key={name} className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300">{label}</label>
                <div className="relative">
                  <Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className="w-full bg-slate-800/60 border border-slate-700 hover:border-slate-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all duration-200"
                  />
                </div>
              </div>
            ))}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold px-6 py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-amber-500/20 text-sm"
              >
                <Save size={14} />
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setError('');
                  setFormData({ name: user.name, email: user.email, password: '', confirmPassword: '' });
                }}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-semibold px-6 py-2.5 rounded-xl transition-all duration-200 text-sm"
              >
                <X size={14} />
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;