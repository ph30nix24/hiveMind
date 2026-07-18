import { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../../utils/firebase';
import { googleLoginApi, signUpApi } from '../services/auth.apis';
import { GoogleIcon } from '../../../utils/icons';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { addToast } from '../../../redux/features/toastSlice';
import { setUser } from '../../../redux/features/userSlice';

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




/* ── SignUpForm ────────────────────────────────────────────── */
const SignUpForm = () => {
  const [fields, setFields] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate()
  const dispatch =  useDispatch()

  const strength = getStrength(fields.password);

  const handleChange = (e) => setFields((p) => ({ ...p, [e.target.id]: e.target.value }));
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (fields.password !== fields.confirmPassword) {
      dispatch(addToast("Passwords do not match", "error"))
      return;
    }
    try {
      const data = await signUpApi({ ...fields })
      dispatch(setUser(data.user))
      dispatch(addToast(`Congrutions ${data.message}`, "success"))
      navigate(`/auth/${data.data.user._id}/verify-email`)
    } catch (e) {
      addToast()
      dispatch(addToast(`Failed to SignUp ${e.response?.data.message}`, "error"))
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const data = await signInWithPopup(auth, googleProvider)
      const idToken = await data.user.getIdToken();
      const resData = await googleLoginApi({ token: idToken })
      dispatch(setUser(resData.user))
      dispatch(addToast(`Congrutions ${resData.message}`, "success"))
    } catch (e) {
      dispatch(addToast(`Failed to SignUp ${e.response?.data.message}`, "error"))
    }
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
            <label className="block text-sm font-medium text-text-main" htmlFor="name">
              Full Name
            </label>
            <div className="relative">
              <div className={iconLeft}><User size={20} /></div>
              <input id="name" type="text" className={inputBase} placeholder="Enter your full name"
                value={fields.name} onChange={handleChange} required autoComplete="name" />
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
                value={fields.email} onChange={handleChange} required autoComplete="email" />
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
                autoComplete="new-password" required/>
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
                autoComplete="new-password" required/>
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
