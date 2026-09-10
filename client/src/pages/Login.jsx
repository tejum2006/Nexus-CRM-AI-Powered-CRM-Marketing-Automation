import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';

const loginSchema = z.object({
  email:    z.string().email('Enter a valid email'),
  password: z.string().min(6, 'At least 6 characters required'),
});

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      setError('');
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[var(--bg-app)] relative overflow-hidden py-12 px-6">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-[var(--brand-primary)] opacity-10 blur-[100px]" />
        <div className="absolute top-[40%] -right-[10%] w-[50%] h-[50%] rounded-full bg-[var(--brand-premium)] opacity-[0.05] blur-[100px]" />
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--brand-primary)] shadow-[0_0_20px_rgba(59,130,246,0.3)] mb-6">
            <span className="font-mono font-bold text-white text-2xl leading-none">N</span>
          </div>
          <h1 className="heading-1 mb-2">Welcome back</h1>
          <p className="text-body">Sign in to your Nexus workspace</p>
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
              <label className="label">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] pointer-events-none" />
                <input
                  type="email"
                  placeholder="you@company.com"
                  autoComplete="email"
                  className="input"
                  style={{ paddingLeft: '2.5rem' }}
                  {...register('email')}
                />
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
                  autoComplete="current-password"
                  className="input"
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors p-1"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-[var(--status-error)] mt-1.5">{errors.password.message}</p>}
            </div>

            <div style={{ paddingTop: '24px' }}>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn btn-primary py-2.5 text-[15px]"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn size={18} />
                    Sign in
                  </>
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
            Don't have an account?{' '}
            <Link to="/register" className="text-[var(--brand-primary)] hover:text-[var(--brand-primary)]/80 font-semibold transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
