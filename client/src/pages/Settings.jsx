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
    <div className="page-enter">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="text-display mb-1">Settings</h1>
          <p className="text-body">Manage your account and preferences.</p>
        </div>
      </div>

      <div className="max-w-3xl grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Left: Profile Card */}
        <div className="space-y-4">
          <div className="card p-6 flex flex-col items-center text-center">
            {/* Avatar */}
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold mb-4 shrink-0"
              style={{
                background: 'var(--gold-dim)',
                border: '2px solid var(--gold-border)',
                color: 'var(--gold-light)',
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </div>

            <h3 className="text-heading mb-0.5">{user?.name}</h3>
            <p className="text-caption mb-4">{user?.email}</p>

            {/* Role badge */}
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11.5px] font-medium"
              style={{
                background: 'var(--bg-hover)',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
              }}
            >
              <Shield size={11} style={{ color: 'var(--gold)' }} />
              {user?.role}
            </div>
          </div>

          {/* Sign out */}
          <div className="card p-3">
            <button
              onClick={logout}
              className="btn btn-danger btn-full"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        </div>

        {/* Right: Edit Form */}
        <div className="md:col-span-2">
          <div className="card p-6">
            <h2 className="text-heading mb-6">Personal Information</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Name */}
              <div>
                <label className="label">Full Name</label>
                <div className="relative">
                  <UserIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    className="input input-with-icon"
                    placeholder="John Doe"
                    {...register('name')}
                  />
                </div>
                {errors.name && <p className="field-error">{errors.name.message}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="label">Email Address</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
                  <input
                    type="email"
                    className="input input-with-icon"
                    placeholder="john@example.com"
                    {...register('email')}
                  />
                </div>
                {errors.email && <p className="field-error">{errors.email.message}</p>}
              </div>

              {/* Divider */}
              <hr style={{ borderColor: 'var(--border)' }} />

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="label mb-0">Change Password</label>
                  <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Leave blank to keep current</span>
                </div>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
                  <input
                    type="password"
                    className="input input-with-icon"
                    placeholder="New password"
                    {...register('password')}
                  />
                </div>
                {errors.password && <p className="field-error">{errors.password.message}</p>}
              </div>

              {/* Submit */}
              <div className="flex justify-end pt-2">
                <button type="submit" disabled={isSaving} className="btn btn-primary">
                  {isSaving ? (
                    <><span className="btn-spinner" /> Saving...</>
                  ) : (
                    <><Save size={14} /> Save Changes</>
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
