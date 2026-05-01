import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, LockKeyhole, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthPage({ mode = 'sign-in' }) {
  const isSignUp = mode === 'sign-up';
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { signIn, signUp, signInWithGoogle, enterDemoMode, firebaseEnabled } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const nextPath = location.state?.from || '/dashboard';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      if (isSignUp) {
        await signUp(form);
      } else {
        await signIn(form);
      }
      navigate(nextPath, { replace: true });
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#070707] px-4 py-8 text-white sm:px-6">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-10 lg:grid-cols-[1fr_440px]">
        <section className="space-y-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/35">CryptoPilot access</p>
          <h1 className="max-w-3xl text-5xl font-black leading-[0.92] tracking-[-0.04em] sm:text-6xl">
            Trade discipline deserves a serious login.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-white/46">
            Sign in to unlock live markets, simulated portfolio analytics, strategy tracking, and your private AI workspace.
          </p>
          <div className="grid gap-px bg-white/10 sm:grid-cols-3">
            {[
              ['Live markets', ShieldCheck],
              ['Protected routes', LockKeyhole],
              ['Portfolio memory', ArrowRight],
            ].map(([label, Icon]) => (
              <div key={label} className="bg-[#0d0d0d] p-5">
                <Icon className="mb-8 text-white/35" size={18} />
                <p className="text-sm font-bold text-white">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="premium-panel p-6 sm:p-8">
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/35">
              {isSignUp ? 'Create account' : 'Welcome back'}
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-white">
              {isSignUp ? 'Set up your trading cockpit.' : 'Enter your trading cockpit.'}
            </h2>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {isSignUp && (
              <input
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                className="w-full border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-white/30"
                placeholder="Full name"
              />
            )}
            <input
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              className="w-full border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-white/30"
              placeholder="Email address"
              type="email"
            />
            <input
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              className="w-full border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-white/30"
              placeholder="Password"
              type="password"
            />
            {error ? <p className="text-sm text-red-300">{error}</p> : null}
            <button
              type="submit"
              disabled={submitting || !firebaseEnabled}
              className="w-full bg-white px-6 py-3 text-xs font-bold uppercase tracking-[0.16em] text-black transition-colors hover:bg-white/85 disabled:cursor-not-allowed disabled:bg-white/30 disabled:text-white/60"
            >
              {submitting ? 'Authenticating...' : isSignUp ? 'Create account' : 'Sign in'}
            </button>
          </form>

          <div className="mt-4 space-y-3">
            <button
              type="button"
              onClick={async () => {
                setSubmitting(true);
                setError('');
                try {
                  await signInWithGoogle();
                  navigate(nextPath, { replace: true });
                } catch (err) {
                  setError(err.message || 'Google sign-in failed');
                } finally {
                  setSubmitting(false);
                }
              }}
              disabled={!firebaseEnabled}
              className="w-full border border-white/10 bg-white/[0.03] px-6 py-3 text-xs font-bold uppercase tracking-[0.16em] text-white transition-colors hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:text-white/30"
            >
              Continue with Google
            </button>

            {!firebaseEnabled ? (
              <button
                type="button"
                onClick={() => {
                  enterDemoMode();
                  navigate(nextPath, { replace: true });
                }}
                className="w-full border border-emerald-300/20 bg-emerald-300/10 px-6 py-3 text-xs font-bold uppercase tracking-[0.16em] text-emerald-100"
              >
                Launch demo mode
              </button>
            ) : null}
          </div>

          <div className="mt-6 text-sm text-white/46">
            {isSignUp ? 'Already have an account?' : 'Need an account?'}{' '}
            <Link className="text-white" to={isSignUp ? '/sign-in' : '/sign-up'}>
              {isSignUp ? 'Sign in' : 'Create one'}
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
