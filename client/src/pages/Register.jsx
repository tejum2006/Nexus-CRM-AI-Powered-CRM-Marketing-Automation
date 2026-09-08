import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, AlertCircle, Hexagon, Eye, EyeOff } from 'lucide-react';

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
    <div className="auth-page" style={{
      minHeight: '100vh',
      background: 'var(--bg-base)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 20px',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* ── Gradient Beam Layer ─────────────────────────────── */}
      <div style={{
        position: 'fixed',
        top: '-200px', right: '-120px',
        width: '650px', height: '650px',
        background: 'conic-gradient(from 200deg at 60% 40%, transparent 0deg, rgba(200,135,74,0.12) 35deg, rgba(219,168,112,0.06) 65deg, transparent 95deg)',
        borderRadius: '50%',
        filter: 'blur(70px)',
        pointerEvents: 'none',
        animation: 'beamFloat 16s ease-in-out infinite',
      }} />
      <div style={{
        position: 'fixed',
        bottom: '-200px', left: '-100px',
        width: '600px', height: '600px',
        background: 'conic-gradient(from 50deg at 40% 60%, transparent 0deg, rgba(200,135,74,0.08) 40deg, rgba(245,200,80,0.04) 70deg, transparent 100deg)',
        borderRadius: '50%',
        filter: 'blur(80px)',
        pointerEvents: 'none',
        animation: 'beamFloat 20s ease-in-out infinite reverse 2s',
      }} />
      <div style={{
        position: 'fixed',
        top: '20%', right: '-60px',
        width: '420px', height: '420px',
        background: 'conic-gradient(from 270deg at 55% 50%, transparent 0deg, rgba(52,211,153,0.05) 30deg, rgba(16,185,129,0.03) 55deg, transparent 75deg)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        pointerEvents: 'none',
        animation: 'beamFloat 24s ease-in-out infinite 6s',
      }} />

      {/* Diagonal light shaft */}
      <div style={{
        position: 'fixed',
        top: '-20%', left: '55%',
        width: '2px', height: '140vh',
        background: 'linear-gradient(180deg, transparent 0%, rgba(200,135,74,0.07) 25%, rgba(219,168,112,0.11) 50%, rgba(200,135,74,0.05) 75%, transparent 100%)',
        transform: 'rotate(-20deg)',
        transformOrigin: 'top center',
        filter: 'blur(22px)',
        pointerEvents: 'none',
      }} />

      {/* ── Form Column ─────────────────────────────────────── */}
      <div className="page-enter auth-column" style={{ width: '100%', maxWidth: '380px', position: 'relative', zIndex: 1 }}>

        {/* Brand */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '11px', marginBottom: '28px' }}>
            <img 
              src="/logo.png" 
              alt="Nexus" 
              style={{
                width: '48px', height: '48px',
                borderRadius: '10px',
                objectFit: 'cover',
                boxShadow: '0 0 16px rgba(248,186,51,0.35), 0 2px 8px rgba(0,0,0,0.4)',
                flexShrink: 0,
              }} 
            />
            <span style={{
              fontSize: '18px', fontWeight: '700',
              color: 'transparent', letterSpacing: '-0.02em',
              backgroundClip: 'text', WebkitBackgroundClip: 'text',
              backgroundImage: 'linear-gradient(to right, #f8fafc, #94a3b8)'
            }}>
              Nexus
            </span>
          </div>

          <h1 className="auth-title" style={{
            fontSize: '26px', fontWeight: '600',
            letterSpacing: '-0.03em', lineHeight: 1.15,
            marginBottom: '8px',
            background: 'linear-gradient(135deg, #e8e3db 0%, #a8a49c 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Create an account
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            Start managing campaigns with AI
          </p>
        </div>

        {error && (
          <div className="alert-error" style={{ marginBottom: '20px' }}>
            <AlertCircle size={15} style={{ flexShrink: 0, marginTop: '1px' }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ marginBottom: '14px' }}>
            <label className="label">Full name</label>
            <div style={{ position: 'relative' }}>
              <User size={14} style={{
                position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                color: 'var(--text-muted)', pointerEvents: 'none',
              }} />
              <input type="text" placeholder="Jane Smith" autoComplete="name"
                className="input input-with-icon" {...register('name')} />
            </div>
            {errors.name && <p className="field-error">{errors.name.message}</p>}
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label className="label">Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={14} style={{
                position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                color: 'var(--text-muted)', pointerEvents: 'none',
              }} />
              <input type="email" placeholder="you@company.com" autoComplete="email"
                className="input input-with-icon" {...register('email')} />
            </div>
            {errors.email && <p className="field-error">{errors.email.message}</p>}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label className="label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={14} style={{
                position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                color: 'var(--text-muted)', pointerEvents: 'none',
              }} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="new-password"
                className="input input-with-icon"
                style={{ paddingRight: '40px' }}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                style={{
                  position: 'absolute', right: '10px',
                  top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--text-muted)', padding: '4px',
                  display: 'flex', alignItems: 'center',
                  transition: 'color 0.15s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {errors.password && <p className="field-error">{errors.password.message}</p>}
          </div>

          {/* Role selector */}
          <div style={{ marginBottom: '24px' }}>
            <label className="label">Role</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              {ROLES.map((r) => {
                const active = role === r.value;
                return (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => handleRoleChange(r.value)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '10px 13px',
                      background: active
                        ? 'linear-gradient(135deg, rgba(200,135,74,0.14) 0%, rgba(219,168,112,0.08) 100%)'
                        : 'var(--bg-input)',
                      border: `1px solid ${active ? 'var(--gold-border)' : 'var(--border)'}`,
                      borderRadius: 'var(--r-md)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      textAlign: 'left',
                    }}
                  >
                    <div>
                      <div style={{
                        fontSize: '13px', fontWeight: '500', letterSpacing: '-0.01em',
                        color: active ? 'var(--gold-light)' : 'var(--text-primary)',
                      }}>
                        {r.label}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {r.desc}
                      </div>
                    </div>

                    <div style={{
                      width: '16px', height: '16px', borderRadius: '50%', flexShrink: 0,
                      background: active
                        ? 'linear-gradient(135deg, #f8ba33, #f3a20e)'
                        : 'transparent',
                      border: `1.5px solid ${active ? 'transparent' : 'var(--border-hover)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: active ? '0 0 8px rgba(248,186,51,0.4)' : 'none',
                      transition: 'all 0.15s ease',
                    }}>
                      {active && (
                        <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#050507' }} />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
            <input type="hidden" {...register('role')} value={role} />
            {errors.role && <p className="field-error">{errors.role.message}</p>}
          </div>

          {/* Submit — copper gradient button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-full"
            style={{
              padding: '12px',
              fontSize: '14.5px',
              fontWeight: '600',
              letterSpacing: '0.02em',
              color: 'var(--text-inverted)',
              background: isSubmitting
                ? 'var(--gold)'
                : 'linear-gradient(135deg, #f8ba33 0%, #fbd069 40%, #f3a20e 100%)',
              border: 'none',
              borderRadius: 'var(--r-pill)',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 16px rgba(243, 162, 14, 0.3), inset 0 1px 1px rgba(255,255,255,0.4)',
              transition: 'all 0.25s ease',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              opacity: isSubmitting ? 0.7 : 1,
            }}
            onMouseEnter={e => { if (!isSubmitting) e.currentTarget.style.filter = 'brightness(1.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.filter = 'none'; }}
          >
            {isSubmitting ? (
              <><span className="btn-spinner" /> Creating account...</>
            ) : (
              'Create account'
            )}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '22px 0 18px' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>or</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
        </div>

        <p style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center' }}>
          Already have an account?{' '}
          <Link to="/login" className="nexus-link">Sign in</Link>
        </p>

        <p style={{ marginTop: '36px', fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', letterSpacing: '0.02em' }}>
          Secured with JWT encryption
        </p>
      </div>
    </div>
  );
}
