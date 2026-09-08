import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Mail, Lock, AlertCircle, Hexagon, Eye, EyeOff } from 'lucide-react';

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
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'var(--bg-base)', padding: '32px 20px' }}
    >

      {/* Subtle background gradient */}
      <div className="pointer-events-none fixed inset-0" aria-hidden>
        <div style={{
          position: 'absolute',
          top: '-20%', left: '-10%',
          width: '60%', height: '60%',
          background: 'radial-gradient(circle, rgba(232,160,32,0.06) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-20%', right: '-10%',
          width: '50%', height: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.04) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }} />
      </div>

      {/* Card */}
      <div className="page-enter relative z-10 w-full" style={{ maxWidth: '380px' }}>

        {/* Brand */}
        <div className="mb-8">
          <div className="flex items-center gap-2.5 mb-7">
            <img src="/logo.png" alt="Nexus" className="w-8 h-8 shrink-0 rounded-lg object-cover" />
            <span className="font-bold text-[17px] tracking-tight text-[var(--text-primary)]"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Nexus
            </span>
          </div>
          <h1 className="text-[24px] font-semibold tracking-tight text-[var(--text-primary)] mb-1.5"
            style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.025em' }}>
            Welcome back
          </h1>
          <p className="text-body">Sign in to your workspace to continue</p>
        </div>

        {/* Error */}
        {error && (
          <div className="alert-error mb-5">
            <AlertCircle size={14} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* Email */}
          <div>
            <label className="label">Email</label>
            <div className="relative">
              <Mail
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: 'var(--text-muted)' }}
              />
              <input
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
                className="input input-with-icon"
                {...register('email')}
              />
            </div>
            {errors.email && <p className="field-error">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="label">Password</label>
            <div className="relative">
              <Lock
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: 'var(--text-muted)' }}
              />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="current-password"
                className="input input-with-icon"
                style={{ paddingRight: '40px' }}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            {errors.password && <p className="field-error">{errors.password.message}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary btn-full mt-2"
            style={{ height: '42px', fontSize: '14px' }}
          >
            {isSubmitting ? (
              <>
                <span className="btn-spinner" />
                Signing in...
              </>
            ) : (
              <>
                <LogIn size={15} />
                Sign in
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
          <span className="text-caption">or</span>
          <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
        </div>

        <p className="text-center text-caption">
          Don't have an account?{' '}
          <Link to="/register" className="nexus-link">Create one</Link>
        </p>

        <p className="text-center mt-8" style={{ fontSize: '11px', color: 'var(--text-faint)' }}>
          Secured with JWT encryption
        </p>
      </div>
    </div>
  );
}
