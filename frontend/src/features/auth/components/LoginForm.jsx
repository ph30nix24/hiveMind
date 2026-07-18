import { useState } from 'react';
import { Link } from 'react-router';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../../utils/firebase';
import { googleLoginApi, loginApi } from '../services/auth.apis';
import { useDispatch } from 'react-redux';
import { addToast } from '../../../redux/features/toastSlice';
import { GoogleIcon } from '../../../utils/icons';
import { setUser } from '../../../redux/features/userSlice';

/* ── Social Icons ─────────────────────────────────────────── */





/* ── LoginForm ────────────────────────────────────────────── */
const LoginForm = () => {
    const [fields, setFields] = useState({ email: '', password: '' });
    const [showPw, setShowPw] = useState(false);
    const [remember, setRemember] = useState(false);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch()
    const handleChange = (e) => setFields((p) => ({ ...p, [e.target.id]: e.target.value }));

    const googleLogin = async () => {
        try {
            const data = await signInWithPopup(auth, googleProvider);
            const idToken = await data.user.getIdToken();
            const res = await googleLoginApi({ token: idToken })
            dispatch(setUser(res.user))
            dispatch(addToast(`congrats ${res.message}`, "success"))
        } catch (error) {
            dispatch(addToast(`Failed ${error.response?.data.message}`, "error"))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await loginApi({ ...fields })
            dispatch(setUser(data.user))
            dispatch(addToast(`congrats ${data.message}`, "success"))
        } catch (error) {
            dispatch(addToast(`Failed to login ${error.response?.data.message}`, "error"))
        }
    };

    const inputBase =
        'input-field block w-full rounded-lg py-3 pr-3 pl-10 text-sm font-[inherit] focus:ring-0';
    const inputWithRight =
        'input-field block w-full rounded-lg py-3 pr-10 pl-10 text-sm font-[inherit] focus:ring-0';
    const iconLeft =
        'absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#94a3b8]';

    return (
        <div className="w-full max-w-md shrink-0 animate-fade-in-up-delay">
            <div className="glass-panel rounded-2xl p-5 md:p-10 w-full relative overflow-hidden">
                {/* Background glows */}
                <div
                    className="absolute top-0 right-0 w-72 h-72 bg-primary/20 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2 pointer-events-none"
                    aria-hidden="true"
                />
                <div
                    className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/15 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2 pointer-events-none"
                    aria-hidden="true"
                />

                {/* Panel header */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2 font-heading">Welcome back</h2>
                    <p className="text-text-muted font-body text-[15px]">Sign in to continue to Hivemind AI</p>
                </div>

                <form className="space-y-3 md:space-y-5 font-body" onSubmit={handleSubmit}>
                    {/* Email */}
                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-text-main" htmlFor="email">
                            Email Address
                        </label>
                        <div className="relative">
                            <div className={iconLeft}><Mail size={20} /></div>
                            <input
                                id="email"
                                type="email"
                                className={inputBase}
                                placeholder="Enter your email"
                                value={fields.email}
                                onChange={handleChange}
                                autoComplete="email"
                                required
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <label className="block text-sm font-medium text-text-main" htmlFor="password">
                                Password
                            </label>
                            <a
                                href="#"
                                className="text-xs text-primary hover:text-white transition-colors no-underline"
                            >
                                Forgot password?
                            </a>
                        </div>
                        <div className="relative">
                            <div className={iconLeft}><Lock size={20} /></div>
                            <input
                                id="password"
                                type={showPw ? 'text' : 'password'}
                                className={inputWithRight}
                                placeholder="Enter your password"
                                minLength={8}
                                maxLength={16}
                                value={fields.password}
                                onChange={handleChange}
                                autoComplete="current-password"
                                required
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-muted hover:text-white transition-colors bg-transparent border-none cursor-pointer"
                                onClick={() => setShowPw((v) => !v)}
                                aria-label={showPw ? 'Hide password' : 'Show password'}
                            >
                                {showPw ? <Eye size={20} /> : <EyeOff size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Remember me */}
                    <label className="flex items-center gap-3 cursor-pointer group" htmlFor="remember">
                        <div className="relative">
                            <input
                                id="remember"
                                type="checkbox"
                                className="sr-only"
                                checked={remember}
                                onChange={(e) => setRemember(e.target.checked)}
                            />
                            <div
                                className={`w-5 h-5 rounded flex items-center justify-center border transition-all duration-200 ${remember
                                    ? 'bg-primary border-primary'
                                    : 'bg-transparent border-border group-hover:border-primary'
                                    }`}
                            >
                                {remember && (
                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
                                    </svg>
                                )}
                            </div>
                        </div>
                        <span className="text-sm text-text-muted group-hover:text-text-main transition-colors select-none">
                            Remember me for 30 days
                        </span>
                    </label>

                    {/* Submit */}
                    <div className="pt-2">
                        <button
                            id="sign-in-btn"
                            type="submit"
                            disabled={loading}
                            className="btn-gradient w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-lg text-sm font-semibold text-white hover:opacity-90 active:scale-[0.98] transition-all focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 cursor-pointer border-none font-[inherit] disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                    </svg>
                                    Signing in…
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* Divider */}
                <div className="mt-8 relative" role="separator">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-3 bg-[rgba(17,18,28,0.8)] text-text-muted rounded-full border border-border font-body text-xs py-1">
                            or continue with
                        </span>
                    </div>
                </div>

                {/* Social auth */}
                <div className="mt-6 w-full">

                    <button
                        key={'google-login-btn'}
                        id={'google-login-btn'}
                        type="button"
                        aria-label={'Sign in with Google'}
                        className="social-btn-base flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium text-white focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 cursor-pointer font-[inherit] w-full"
                        onClick={() => googleLogin()}

                    >
                        <GoogleIcon />
                        <span className="">Google</span>
                    </button>
                </div>

                {/* Bottom link */}
                <p className="mt-8 text-center text-sm text-text-muted">
                    Don&apos;t have an account?{' '}
                    <Link to="/auth/signup" className="text-primary font-medium hover:text-white transition-colors no-underline">
                        Sign up for free
                    </Link>
                </p>
            </div>

        </div>
    );
};

export default LoginForm;
