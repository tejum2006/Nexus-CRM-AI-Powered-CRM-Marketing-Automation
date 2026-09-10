import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';

const registerSchema = z.object({
  name:     z.string().min(2, 'At least 2 characters required'),
  email:    z.string().email('Enter a valid email'),
  password: z.string().min(6, 'At least 6 characters required'),
  role:     z.enum(['Admin', 'Marketing Manager', 'Sales Executive']),
});

const ROLES = [
  { value: 'Sales Executive',   label: 'Sales Executive',   desc: 'Customer management only' },
  { value: 'Marketing Manager', label: 'Marketing Manager', desc: 'Customers, campaigns & AI tools' },
  { value: 'Admin',             label: 'Admin',             desc: 'Full access to all features' },
];

export default function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [role, setRole] = useState('Sales Executive');
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'Sales Executive' },
  });

  const handleRoleChange = (val) => {
    setRole(val);
    setValue('role', val);
  };

  const onSubmit = async (data) => {
    try {
      setError('');
      await registerUser(data.name, data.email, data.password, data.role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[var(--bg-app)] relative overflow-hidden py-12 px-6">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] rounded-full bg-[var(--brand-primary)] opacity-10 blur-[120px]" />
        <div className="absolute bottom-[10%] left-[5%] w-[50%] h-[50%] rounded-full bg-[var(--brand-premium)] opacity-[0.05] blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--brand-primary)] shadow-[0_0_20px_rgba(59,130,246,0.3)] mb-4">
            <span className="font-mono font-bold text-white text-xl leading-none">N</span>
          </div>
          <h1 className="heading-1 mb-2">Create an account</h1>
          <p className="text-body">Join Nexus and start managing campaigns</p>
        </div>

        <div className="card p-8" style={{ border: 'none', boxShadow: 'none', background: 'transparent' }}>
          {error && (
            <div className="bg-[var(--status-error)]/10 text-[var(--status-error)] p-3 rounded-lg flex items-center gap-2 mb-6 animate-fade-in border border-[var(--status-error)]/20">
              <AlertCircle size={16} className="shrink-0" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <label className="label">Full name</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] pointer-events-none" />
                <input type="text" placeholder="Steve Rogers" autoComplete="name"
                  className="input" style={{ paddingLeft: '2.5rem' }} {...register('name')} />
              </div>
              {errors.name && <p className="text-xs text-[var(--status-error)] mt-1.5">{errors.name.message}</p>}
            </div>

            <div>
              <label className="label">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] pointer-events-none" />
                <input type="email" placeholder="you@company.com" autoComplete="email"
                  className="input" style={{ paddingLeft: '2.5rem' }} {...register('email')} />
              </div>
              {errors.email && <p className="text-xs text-[var(--status-error)] mt-1.5">{errors.email.message}</p>}
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="input"
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors p-1"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-[var(--status-error)] mt-1.5">{errors.password.message}</p>}
            </div>

            {/* Role selector */}
            <div>
              <label className="label mb-3">Role</label>
              <div className="flex flex-col gap-2.5">
                {ROLES.map((r) => {
                  const active = role === r.value;
                  return (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => handleRoleChange(r.value)}
                      className={`flex items-center justify-between p-3.5 rounded-lg border transition-all text-left ${
                        active 
                          ? 'bg-[var(--brand-primary)]/5 border-[var(--brand-primary)] shadow-[0_0_0_1px_var(--brand-primary)]' 
                          : 'bg-[var(--bg-app)] border-[var(--border-subtle)] hover:bg-[var(--bg-surface-hover)]'
                      }`}
                    >
                      <div>
                        <div className={`text-sm font-semibold mb-0.5 ${active ? 'text-[var(--brand-primary)]' : 'text-[var(--text-primary)]'}`}>
                          {r.label}
                        </div>
                        <div className="text-xs text-[var(--text-secondary)]">
                          {r.desc}
                        </div>
                      </div>
                      
                      {/* Radio indicator */}
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                        active ? 'bg-[var(--brand-primary)] border-transparent' : 'border border-[var(--border-subtle)] bg-[var(--bg-surface)]'
                      }`}>
                        {active && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
              <input type="hidden" {...register('role')} value={role} />
              {errors.role && <p className="text-xs text-[var(--status-error)] mt-1.5">{errors.role.message}</p>}
            </div>

            <div style={{ paddingTop: '8px' }}>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn btn-primary py-2.5 text-[15px]"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Create account'
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 flex items-center justify-between text-sm">
            <div className="w-full h-px bg-[var(--border-subtle)]" />
            <span className="px-4 text-[var(--text-tertiary)]">or</span>
            <div className="w-full h-px bg-[var(--border-subtle)]" />
          </div>

          <p className="mt-8 text-center text-sm text-[var(--text-secondary)]">
            Already have an account?{' '}
            <Link to="/login" className="text-[var(--brand-primary)] hover:text-[var(--brand-primary)]/80 font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
