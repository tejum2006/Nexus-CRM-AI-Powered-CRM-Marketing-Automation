import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../context/ToastContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User as UserIcon, Mail, Lock, Shield, Save, LogOut } from 'lucide-react';

const profileSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal('')),
});

const Settings = () => {
  const { user, updateUser, logout } = useAuth();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      password: '',
    }
  });

  const onSubmit = async (data) => {
    try {
      setIsSaving(true);
      const updateData = { name: data.name, email: data.email };
      if (data.password) updateData.password = data.password;
      await updateUser(updateData);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="page-scroll flex flex-col" style={{ gap: '24px' }}>
      {/* Header */}
      <div className="page-header shrink-0">
        <div>
          <h1 className="heading-1 mb-1">Settings</h1>
          <p className="text-body">Manage your account and preferences.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Left: Profile Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card flex flex-col items-center text-center relative overflow-hidden border-t-4 border-t-[var(--brand-primary)]" style={{ padding: '24px' }}>
            
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/20 flex items-center justify-center text-3xl font-bold text-[var(--brand-primary)] mb-5 shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>

            <h3 className="text-xl font-bold text-white mb-1">{user?.name}</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-6">{user?.email}</p>

            {/* Role badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider bg-[var(--brand-premium)]/10 text-[var(--brand-premium)]">
              <Shield size={14} />
              {user?.role}
            </div>
          </div>

          {/* Sign out */}
          <div className="card" style={{ padding: '24px' }}>
            <button
              onClick={logout}
              className="w-full btn btn-danger"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>

        {/* Right: Profile Form */}
        <div className="md:col-span-2">
          <div className="card" style={{ padding: '24px', border: 'none', boxShadow: 'none', background: 'transparent' }}>
            <div className="mb-6 pb-6 border-b border-[var(--border-subtle)]">
              <h2 className="heading-3 mb-0">Profile Details</h2>
              <p className="text-small">Update your personal information and password.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '28rem' }}>
              <div>
                <label className="input-label">Full Name</label>
                <div className="relative">
                  <UserIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] pointer-events-none z-10" />
                  <input
                    type="text"
                    className="input"
                    style={{ paddingLeft: '2.5rem' }}
                    placeholder="Steve Rogers"
                    {...register('name')}
                  />
                </div>
                {errors.name && <p className="text-xs text-[var(--status-error)] mt-1.5">{errors.name.message}</p>}
              </div>

              <div>
                <label className="input-label">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] pointer-events-none z-10" />
                  <input
                    type="email"
                    className="input"
                    style={{ paddingLeft: '2.5rem' }}
                    placeholder="you@company.com"
                    {...register('email')}
                  />
                </div>
                {errors.email && <p className="text-xs text-[var(--status-error)] mt-1.5">{errors.email.message}</p>}
              </div>

              <div>
                <label className="input-label">
                  New Password
                  <span className="text-xs text-[var(--text-tertiary)] font-normal ml-2">(leave blank to keep current)</span>
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] pointer-events-none z-10" />
                  <input
                    type="password"
                    className="input"
                    style={{ paddingLeft: '2.5rem' }}
                    placeholder="••••••••"
                    {...register('password')}
                  />
                </div>
                {errors.password && <p className="text-xs text-[var(--status-error)] mt-1.5">{errors.password.message}</p>}
              </div>

              <div style={{ paddingTop: '8px', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn btn-primary"
                >
                  {isSaving ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                  ) : (
                    <><Save size={16} /> Save Changes</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;
