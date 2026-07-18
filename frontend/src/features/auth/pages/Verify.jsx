import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeftIcon, ArrowRightIcon, ChevronDown, ClockIcon, MailSmIcon } from '../../../utils/icons';
import { NeuralCanvas } from '../components/NeuralCanvas';
import { features } from '../../../utils';
import { emailVerifyApi } from '../services/auth.apis';
import { useDispatch } from 'react-redux';
import { addToast } from '../../../redux/features/toastSlice';
import { setError } from '../../../redux/features/userSlice';


const GLYPH_POOL = Array.from({ length: 24 }, (_, i) => ({
    id: i, char: '01001101010001110101010111001100101010'[i % 36],
    left: `${(i * 4.2 + 1) % 100}%`, delay: `${(i * 0.38) % 7}s`, dur: `${8 + (i % 5)}s`,
    size: i % 3 === 0 ? '0.8rem' : '0.65rem', opacity: i % 4 === 0 ? 0.14 : 0.08,
}));
function BinaryRain() {
    return <>{GLYPH_POOL.map(g => (
        <span key={g.id} className="binary-glyph pointer-events-none absolute select-none font-mono"
            style={{
                left: g.left, fontSize: g.size, color: `rgba(100,120,255,${g.opacity})`,
                animationDuration: g.dur, animationDelay: g.delay
            }}>{g.char}</span>
    ))}</>;
}


/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════ */
const OTP_TOTAL = 5 * 60;   // 5 minutes
const RESEND_SECS = 30;

export default function Verify() {
    const [otp, setOtp] = useState(Array(6).fill(''));
    const [status, setStatus] = useState('idle'); // idle|loading|success|error
    const [errorMsg, setErrorMsg] = useState('');
    const [resendTimer, setResendTimer] = useState(RESEND_SECS);
    const [canResend, setCanResend] = useState(false);
    const [shake, setShake] = useState(false);
    const [otpTimer, setOtpTimer] = useState(OTP_TOTAL);
    const [expired, setExpired] = useState(false);
    const inputRefs = useRef([]);
    const dispatch = useDispatch()
    const navigate = useNavigate()

    /* Resend countdown */
    useEffect(() => {
        if (canResend) return;
        if (resendTimer === 0) { setCanResend(true); return; }
        const id = setTimeout(() => setResendTimer(t => t - 1), 1000);
        return () => clearTimeout(id);
    }, [resendTimer, canResend]);

    /* 5-min OTP expiry */
    useEffect(() => {
        if (expired || status === 'success') return;
        if (otpTimer === 0) { setExpired(true); return; }
        const id = setTimeout(() => setOtpTimer(t => t - 1), 1000);
        return () => clearTimeout(id);
    }, [otpTimer, expired, status]);

    useEffect(() => { inputRefs.current[0]?.focus(); }, []);

    const focusNext = i => inputRefs.current[i + 1]?.focus();
    const focusPrev = i => inputRefs.current[i - 1]?.focus();
    const triggerShake = () => { setShake(true); setTimeout(() => setShake(false), 600); };

    const handleChange = (e, idx) => {
        const val = e.target.value.replace(/\D/g, '').slice(-1);
        const next = [...otp]; next[idx] = val; setOtp(next);
        setStatus('idle'); setErrorMsg('');
        if (val) focusNext(idx);
    };
    const handleKeyDown = (e, idx) => {
        if (e.key === 'Backspace') {
            if (otp[idx]) { const n = [...otp]; n[idx] = ''; setOtp(n); } else focusPrev(idx);
        } else if (e.key === 'ArrowLeft') focusPrev(idx);
        else if (e.key === 'ArrowRight') focusNext(idx);
    };
    const handlePaste = useCallback((e) => {
        e.preventDefault();
        const p = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (!p) return;
        const next = Array(6).fill(''); p.split('').forEach((c, i) => { next[i] = c; });
        setOtp(next); setStatus('idle'); setErrorMsg('');
        inputRefs.current[Math.min(p.length, 5)]?.focus();
    }, []);

    const handleVerify = async () => {
        if (expired) return;
        const code = otp.join('');
        if (code.length < 6) { setErrorMsg('Please enter all 6 digits.'); triggerShake(); return; }

        try {
            const data = await emailVerifyApi({ code });
            dispatch(addToast(`Congrutions ${data.message}`, "success"))
            navigate('/')
        } catch (e) {
            dispatch(addToast(`Failed to SignUp ${e.response?.data.message}`, "error"))
            dispatch(setError(e.response?.data.message))
            setStatus('error'); setErrorMsg('Invalid code. Please try again.');
            triggerShake(); setOtp(Array(6).fill(''));
            setTimeout(() => inputRefs.current[0]?.focus(), 50);

        }
    };

    const handleResend = () => {
        if (!canResend) return;
        setOtp(Array(6).fill('')); setStatus('idle'); setErrorMsg('');
        setResendTimer(RESEND_SECS); setCanResend(false);
        setOtpTimer(OTP_TOTAL); setExpired(false);
        setTimeout(() => inputRefs.current[0]?.focus(), 50);
    };

    const mins = Math.floor(otpTimer / 60);
    const secs = otpTimer % 60;
    const mmss = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    const resendMmss = `${String(Math.floor(resendTimer / 60)).padStart(2, '0')}:${String(resendTimer % 60).padStart(2, '0')}`;
    const allFilled = otp.every(d => d !== '');


    return (
        <div className="min-h-screen flex flex-col relative" style={{ background: '#09091a', overflow: 'hidden' }}>

            {/* AI background */}
            <NeuralCanvas />
            <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
                <BinaryRain />
                <div className="absolute -top-48 -left-48 w-175 h-175 rounded-full bg-radial from-[#3c5aff1c] from-0% to-transparent to-65%" />
                <div className="absolute -bottom-48 -right-48 size-175 rounded-full bg-radial from-[#8c46f01a] from-0% to-transparent to-65%" />
            </div>

            {/* ── HEADER ───────────────────────────────────────────── */}
            <header className="relative z-20 flex items-center justify-between px-8 py-4">
                {/* Brand */}
                <Link to="/" className="flex items-center gap-2 no-underline" aria-label="Hivemind AI Home">
                    <img src="../../../../hiveLogo.png" className="size-7" alt="" />
                    <span className="text-xl font-semibold tracking-tight text-white flex items-baseline gap-1 font-heading">
                        hivemind
                        <span className="text-xs font-bold text-primary">AI</span>
                    </span>
                </Link>

                {/* User pill */}
                <button className="flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors bg-[#ffffff09] border border-white/50">
                    <img src="/avatar.png" alt="Anuj Kumar"
                        className="w-7 h-7 rounded-full object-cover"
                        style={{ border: '2px solid rgba(89,105,255,0.5)' }}
                        onError={e => { e.target.style.display = 'none'; }} />
                    <div className="text-left hidden sm:block">
                        <p className="text-xs" style={{ color: '#64748b', lineHeight: 1.2 }}>Welcome back,</p>
                        <p className="text-sm font-semibold" style={{ color: '#f1f5f9', lineHeight: 1.3 }}>Anuj Kumar</p>
                    </div>
                    <span style={{ color: '#64748b' }}><ChevronDown /></span>
                </button>
            </header>


            <main className="flex-1 relative z-10 w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20 px-6 lg:px-12 py-12">

                {/* ── LEFT COLUMN ─────────────────────────────────── */}
                <div className="flex-1 flex flex-col gap-8 max-w-lg animate-fade-in-up pr-20">
                    <div>
                        <h1 className="text-2xl lg:text-4xl font-bold leading-tight tracking-tight text-white font-heading italic md:text-center lg:text-start">
                            One step closer<br />to unlocking <br className='max-m' />
                            <span className="gradient-text">the power of AI.</span>
                        </h1>
                    </div>

                    {/* Sub-text */}
                    <p className="text-sm leading-relaxed font-body text-text-muted max-w-100 pr-20">
                        We've sent a 6-digit verification code to{' '}
                        <span className="font-semibold text-text-main">anuj@example.com</span>.
                        {' '}Enter the code below to verify your email address.
                    </p>

                    {/* Spam tip card */}
                    <div className="flex items-center gap-4 p-4 font-body rounded-xl bg-[#ffffff07] border border-[#ffffff12]"
                    >
                        <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-linear-to-br from-[#4866ff] to-[#9f54fc]">
                            <span className="text-white"><MailSmIcon /></span>
                        </div>
                        <div>
                            <p className="text-sm font-semibold mb-1" style={{ color: '#f1f5f9' }}>Didn't get the email?</p>
                            <p className="text-xs leading-relaxed" style={{ color: '#64748b' }}>
                                Check your spam or junk folder.<br />Sometimes it hides there.
                            </p>
                        </div>
                    </div>

                    {/* Feature list */}
                    <div className="flex flex-col gap-5 font-body">
                        {features.map(({ id, icon: Icon, iconClass, title, description }) => (
                            <li key={id} className="flex items-center gap-4">
                                <div
                                    className={`shrink-0 size-10 rounded-xl flex items-center justify-center border ${iconClass}`}
                                    aria-hidden="true"
                                >
                                    <Icon size={20} />
                                </div>
                                <div>
                                    <h3 className="text-base font-semibold text-white font-heading">{title}</h3>
                                    <p className="text-xs text-text-muted leading-relaxed font-body">{description}</p>
                                </div>
                            </li>
                        ))}
                    </div>
                </div>

                {/* ── RIGHT CARD ──────────────────────────────────── */}
                <div className="w-full max-w-md animate-fade-in-up-delay rounded-2xl p-8 flex flex-col gap-6 bg-[#0f0f23eb] border border-[#ffffff17] shadow-[0_32px_64px_rgba(0,0,0,0.6)] backdrop-blur-md">
                    <div>
                        <h2 className="text-3xl font-bold mb-5 text-text-main font-heading! " >Verify your email</h2>
                        <p className="text-sm text-text-muted pr-20" >
                            Enter the 6-digit code we sent to{' '}
                            <span className="font-semibold text-text-main" >anuj@example.com</span>
                        </p>
                    </div>

                    {/* Expired banner */}
                    {expired && (
                        <div className="text-center rounded-xl py-2.5 px-4 text-sm font-medium animate-fade-in-up bg-[#ef44441a] border border-[#ef44444d] text-[#f87171]">
                            ⏰ Code expired — request a new one below.
                        </div>
                    )}

                    {/* OTP inputs */}
                    <div>
                        <p className="text-[11px] font-semibold mb-3 font-body uppercase tracking-widest text-text-muted/80"
                        >Verification Code</p>
                        <div className={`flex justify-between gap-2${shake ? ' otp-shake' : ''}`} onPaste={handlePaste}>
                            {otp.map((digit, idx) => (
                                <input
                                    key={idx}
                                    id={`otp-input-${idx}`}
                                    ref={el => (inputRefs.current[idx] = el)}
                                    type="text" inputMode="numeric" maxLength={1}
                                    value={digit}
                                    onChange={e => handleChange(e, idx)}
                                    onKeyDown={e => handleKeyDown(e, idx)}
                                    autoComplete="one-time-code"
                                    disabled={expired}
                                    className="otp-box w-12 h-14 shrink-0 rounded-lg border "
                                    style={{
                                        border: `1.5px solid ${status === 'error'
                                            ? '#ef4444'
                                            : digit
                                                ? 'rgba(89,105,255,0.85)'
                                                : 'rgba(255,255,255,0.12)'
                                            }`,
                                        background: digit
                                            ? 'rgba(89,105,255,0.12)'
                                            : 'rgba(255,255,255,0.04)',
                                        color: expired ? 'rgba(148,163,184,0.3)' : '#f1f5f9',
                                        fontSize: '1.5rem', fontWeight: '700',
                                        textAlign: 'center', lineHeight: '56px',
                                        outline: 'none',
                                        caretColor: 'transparent',
                                        cursor: expired ? 'not-allowed' : 'text',
                                        transition: 'border-color 0.15s, background 0.15s, box-shadow 0.15s',
                                        boxShadow: digit && !expired
                                            ? '0 0 0 3px rgba(89,105,255,0.18)'
                                            : 'none',
                                        userSelect: 'none',
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Error */}
                    {errorMsg && (
                        <p className="text-sm font-medium animate-fade-in-up -mt-2" style={{ color: '#f87171' }}>
                            {errorMsg}
                        </p>
                    )}

                    {/* Timer row */}
                    {!expired && (
                        <div className="flex items-center gap-1.5 -mt-1">
                            <span style={{ color: otpTimer <= 60 ? '#f87171' : otpTimer <= 120 ? '#fb923c' : '#6366f1' }}>
                                <ClockIcon />
                            </span>
                            <span className="text-sm" style={{ color: '#64748b' }}>
                                Code expires in{' '}
                                <span className="font-bold tabular-nums"
                                    style={{ color: otpTimer <= 60 ? '#f87171' : otpTimer <= 120 ? '#fb923c' : '#6366f1' }}>
                                    {mmss}
                                </span>
                            </span>
                        </div>
                    )}

                    {/* Verify button */}
                    <button id="verify-btn" onClick={handleVerify}
                        disabled={status === 'loading' || !allFilled || expired}
                        className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5
                  text-sm font-semibold text-white transition-all duration-200"
                        style={{
                            background: 'linear-gradient(to right,#4866ff,#9f54fc)',
                            opacity: allFilled && status !== 'loading' && !expired ? 1 : 0.45,
                            cursor: allFilled && status !== 'loading' && !expired ? 'pointer' : 'not-allowed',
                            boxShadow: allFilled && !expired ? '0 4px 24px rgba(72,102,255,0.35)' : 'none',
                        }}>
                        {status === 'loading' ? (
                            <>
                                <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                                Verifying…
                            </>
                        ) : (
                            <>Verify Email <ArrowRightIcon /></>
                        )}
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-px bg-[#ffffff14]" />
                        <span className="text-xs text-[#475569]" >or</span>
                        <div className="flex-1 h-px bg-[#ffffff14]" />
                    </div>

                    {/* Back to sign in */}
                    <a href="/auth/signup"
                        className="w-full flex items-center justify-center gap-2 rounded-xl py-3
                  text-sm font-semibold transition-colors border border-[#ffffff1f] hover:border-[#5969ff80] bg-transparent text-text-muted">
                        <ArrowLeftIcon /> Back to Sign In
                    </a>

                    {/* Resend */}
                    <p className="text-sm text-center text-text-muted" style={{ color: '' }}>
                        Didn't receive the code?{' '}
                        {canResend ? (
                            <button id="resend-btn" onClick={handleResend}
                                className="font-semibold transition-colors text-primary hover:text-[#818cf8] cursor-pointer">
                                Resend Code
                            </button>
                        ) : (
                            <span className="font-semibold text-primary">
                                Resend Code{' '}
                                <span className="tabular-nums font-normal text-text-main">
                                    ({resendMmss})
                                </span>
                            </span>
                        )}
                    </p>
                </div>
            </main >

            {/* ── FOOTER ────────────────────────────────────────────── */}
            < footer className="relative z-20 flex items-center justify-between px-8 py-3"
                style={{
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    background: 'rgba(9,9,26,0.70)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)'
                }
                }>
                <p className="text-xs text-text-muted" >
                    © {new Date().getFullYear()} hivemind AI. All rights reserved.
                </p>
                <div className="flex items-center gap-5">
                    {['Privacy', 'Terms', 'Help'].map(l => (
                        <a key={l} href="#" className="text-xs transition-colors text-text-muted/60 hover:text-text-main" >
                            {l}
                        </a>
                    ))}
                </div>
            </footer >

            {/* ── Scoped keyframes ─────────────────────────────────── */}
            < style > {`
        @keyframes otpShake{
          0%,100%{transform:translateX(0)}15%{transform:translateX(-6px)}
          30%{transform:translateX(6px)}45%{transform:translateX(-4px)}
          60%{transform:translateX(4px)}75%{transform:translateX(-2px)}90%{transform:translateX(2px)}
        }
        .otp-shake{animation:otpShake 0.6s ease both}
        .otp-box:focus{
          border-color: #5969ff !important;
          box-shadow: 0 0 0 3px rgba(89,105,255,0.28) !important;
          background: rgba(89,105,255,0.13) !important;
        }
        .otp-box:disabled{
          opacity:0.4;
          cursor:not-allowed;
        }
        .otp-box::-webkit-inner-spin-button,
        .otp-box::-webkit-outer-spin-button { -webkit-appearance:none; }
        /* remove text cursor flicker */
        .otp-box { caret-color: transparent; }
        @keyframes binaryFall{
          0%{transform:translateY(-60px);opacity:0}10%{opacity:1}
          90%{opacity:0.7}100%{transform:translateY(100vh);opacity:0}
        }
        .binary-glyph{animation:binaryFall linear infinite;top:0}
      `}</style >
        </div >
    );
}
