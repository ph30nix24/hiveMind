import { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../../utils/firebase';
import { googleLoginApi } from '../services/auth.apis';

/* ── Password strength ────────────────────────────────────── */
function getStrength(pw) {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

const strengthMeta = [
  { label: '', color: 'bg-[#2a2b38]' },
  { label: 'Weak', color: 'bg-red-500' },
  { label: 'Fair', color: 'bg-orange-500' },
  { label: 'Good', color: 'bg-yellow-400' },
  { label: 'Strong', color: 'bg-green-500' },
];

/* ── Password Strength Bar ────────────────────────────────── */
const StrengthBar = ({ strength }) => {
  const meta = strengthMeta[strength] || strengthMeta[0];
  return (
    <div
      className="flex items-center justify-between mt-2"
      role="status"
      aria-live="polite"
      aria-label={`Password strength: ${meta.label || 'none'}`}
    >
      <div className="flex gap-1 w-30">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i < strength ? meta.color : 'bg-border'
              }`}
          />
        ))}
      </div>
      <span className="text-xs text-text-muted ml-2">
        {meta.label || 'Password strength'}
      </span>
    </div>
  );
};

/* ── Social Icons ─────────────────────────────────────────── */
const GoogleIcon = () => (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);


/* ── SignUpForm ────────────────────────────────────────────── */
const SignUpForm = () => {
  const [fields, setFields] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const strength = getStrength(fields.password);

  const handleChange = (e) => setFields((p) => ({ ...p, [e.target.id]: e.target.value }));
  const handleSubmit = (e) => { e.preventDefault(); console.log(fields); setSubmitted(true); };

  const handleGoogleSignUp = async () => {
    const data = await signInWithPopup(auth, googleProvider)
    const idToken = await data.user.getIdToken();
    const resData = await googleLoginApi({ token: idToken})
    console.log(resData)
  }


  /* Shared class strings */
  const inputBase =
    'input-field block w-full rounded-lg py-3 pr-3 pl-10 text-sm font-[inherit] focus:ring-0';
  const inputWithRight =
    'input-field block w-full rounded-lg py-3 pr-10 pl-10 text-sm font-[inherit] focus:ring-0';
  const iconLeft =
    'absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#94a3b8]';
  const iconRight =
    'absolute inset-y-0 right-0 flex items-center pr-3 text-[#94a3b8] hover:text-white transition-colors bg-transparent border-none cursor-pointer';

  return (
    <div className="w-full md:max-w-xl lg:max-w-lg shrink-0 animate-fade-in-up-delay">
      <div className="glass-panel rounded-2xl p-5 lg:p-10 w-full relative overflow-hidden">
        {/* Background glow */}
        <div
          className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2 pointer-events-none"
          aria-hidden="true"
        />

        {/* Panel header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2 font-heading">Sign up</h2>
          <p className="text-text-muted font-body text-sm">Create your account to get started</p>
        </div>

        <form className="space-y-3 font-body" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-text-main" htmlFor="fullName">
              Full Name
            </label>
            <div className="relative">
              <div className={iconLeft}><User size={20} /></div>
              <input id="fullName" type="text" className={inputBase} placeholder="Enter your full name"
                value={fields.fullName} onChange={handleChange} autoComplete="name" />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-text-main" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <div className={iconLeft}><Mail size={20} /></div>
              <input id="email" type="email" className={inputBase} placeholder="Enter your email"
                value={fields.email} onChange={handleChange} autoComplete="email" />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-text-main" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <div className={iconLeft}><Lock size={20} /></div>
              <input id="password" type={showPw ? 'text' : 'password'} className={inputWithRight}
                placeholder="Create a password" minLength={8} value={fields.password} onChange={handleChange}
                autoComplete="new-password" />
              <button type="button" className={iconRight} onClick={() => setShowPw((v) => !v)}
                aria-label={showPw ? 'Hide password' : 'Show password'}>
                {showPw ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
            <StrengthBar strength={strength} />
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-text-main" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <div className="relative">
              <div className={iconLeft}><Lock size={20} /></div>
              <input id="confirmPassword" type={showConfirm ? 'text' : 'password'} className={inputWithRight}
                placeholder="Confirm your password" value={fields.confirmPassword} onChange={handleChange}
                autoComplete="new-password" />
              <button type="button" className={iconRight} onClick={() => setShowConfirm((v) => !v)}
                aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}>
                {showConfirm ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
          </div>

          {/* Terms */}
          <div className="pt-2">
            <p className="text-xs text-text-muted leading-relaxed">
              By creating an account, you agree to our{' '}
              <a href="/terms" className="text-primary hover:underline">Terms of Service</a> and{' '}
              <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
            </p>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              id="create-account-btn"
              type="submit"
              className="btn-gradient w-full flex justify-center items-center py-3.5 px-4 rounded-lg text-sm font-semibold text-white hover:opacity-90 active:scale-98 transition-all focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 cursor-pointer border-none font-[inherit]"
            >
              Create Account
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="mt-8 relative" role="separator">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-[rgba(17,18,28,0.8)] text-text-muted rounded-full border border-border">
              or continue with
            </span>
          </div>
        </div>

        {/* Social auth */}
        <div className="mt-8 w-full">
            <button
              key='google-signin-btn'
              id='google-signin-btn'
              type="button"
              aria-label='Sign up with Google'
              className=" w-full social-btn-base flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium text-white focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 cursor-pointer font-[inherit]"
              onClick={handleGoogleSignUp}
            >
              <GoogleIcon />
              <span className="">Google</span>
            </button>
        </div>

        {/* Mobile sign-in */}
        <p className="mt-8 text-center text-sm text-text-muted sm:hidden">
          Already have an account?{' '}
          <a href="/signin" className="text-primary font-medium hover:text-white transition-colors no-underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;
