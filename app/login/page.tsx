'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Eye, EyeOff, Heart, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';

type LoginStatus = 'idle' | 'typing' | 'error' | 'success';

export default function LoginPage() {
  const router = useRouter();
  const leftPanelRef = useRef<HTMLElement | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loginStatus, setLoginStatus] = useState<LoginStatus>('idle');
  const [mouse, setMouse] = useState({ x: 50, y: 50, active: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);

  const handleTyping = () => {
    setLoginStatus('typing');
    setError('');
  };

  const getPupilOffset = (
    eyeX: number,
    eyeY: number,
    maxDistance = 1.5,
    errorMode: 'normal' | 'cross-left' | 'cross-right' | 'up' = 'normal'
  ) => {
    if (loginStatus === 'error') {
      if (errorMode === 'cross-left') {
        return { x: maxDistance, y: 0.2 };
      }
      if (errorMode === 'cross-right') {
        return { x: -maxDistance, y: 0.2 };
      }
      if (errorMode === 'up') {
        return { x: 0, y: -maxDistance };
      }
    }

    if (!mouse.active) {
      return { x: 0, y: 0 };
    }

    const dx = mouse.x - eyeX;
    const dy = mouse.y - eyeY;
    const angle = Math.atan2(dy, dx);
    const distance = Math.min(maxDistance, Math.hypot(dx, dy) * 0.08);

    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
    };
  };

  const getBodyOffset = (
    bodyX: number,
    bodyY: number,
    maxDistance = 2,
    maxRotate = 4
  ) => {
    if (!mouse.active) {
      return { x: 0, y: 0, rotate: 0 };
    }

    const dx = mouse.x - bodyX;
    const dy = mouse.y - bodyY;
    const angle = Math.atan2(dy, dx);
    const distance = Math.min(maxDistance, Math.hypot(dx, dy) * 0.085);

    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      rotate: (dx / 100) * maxRotate,
    };
  };

  const getMouthOffset = (
    anchorX: number,
    anchorY: number,
    maxDistance = 1.2,
    maxRotate = 5
  ) => {
    if (!mouse.active) {
      return { x: 0, y: 0, rotate: 0 };
    }

    const dx = mouse.x - anchorX;
    const dy = mouse.y - anchorY;
    const angle = Math.atan2(dy, dx);
    const distance = Math.min(maxDistance, Math.hypot(dx, dy) * 0.05);

    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance * 0.7,
      rotate: (dx / 100) * maxRotate,
    };
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!supabase) {
      setLoginStatus('error');
      setError('Supabase is not configured. Please set environment variables.');
      setLoading(false);
      return;
    }

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        throw authError;
      }

      if (data.user) {
        setLoginStatus('success');
        setSuccess('Logged in successfully. Redirecting...');
        setShowCelebration(true);
        setTimeout(() => {
          router.push('/');
        }, 1000);
      }
    } catch (authFailed) {
      const message =
        authFailed instanceof Error
          ? authFailed.message
          : 'Login failed. Please check your email and password.';
      setError(message);
      setLoginStatus('error');
      setLoading(false);
    }
  };

  return (
    <main
      className="h-dvh overflow-hidden bg-white"
      onMouseMove={(event) => {
        const rect = leftPanelRef.current?.getBoundingClientRect();
        if (!rect) {
          return;
        }
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        setMouse({ x, y, active: true });
      }}
      onMouseLeave={() => setMouse((prev) => ({ ...prev, active: false }))}
    >
      <div className="grid h-full grid-cols-1 md:grid-cols-2">
        <section
          ref={leftPanelRef}
          className="relative h-full overflow-hidden bg-gradient-to-br from-slate-600 via-slate-500 to-slate-400 p-6 text-white md:p-8"
        >
          <div className="flex h-full min-h-0 flex-col">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-md bg-white/95 text-center text-sm font-bold leading-7 text-neutral-900">
                PM
              </div>
              <span className="text-sm font-semibold tracking-wide">PM Love</span>
            </div>

            <div className="flex min-h-0 flex-1 items-end justify-center px-1 pb-0 pt-4 md:pb-1 md:pt-3">
              <svg
                viewBox="0 0 100 100"
                className="mx-auto h-full max-h-full w-full max-w-[560px]"
                aria-label="Animated geometric characters"
              >
                <rect x="0" y="0" width="100" height="100" fill="transparent" />

                <motion.g
                  animate={{
                    ...getBodyOffset(52, 28, 2.6, 5),
                    ...(loginStatus === 'success' ? { y: [0, -2.8, 0], rotate: [0, -5, 4, 0] } : {}),
                    ...(loginStatus === 'error' ? { rotate: -4 } : {}),
                  }}
                  transition={
                    loginStatus === 'success'
                      ? { duration: 0.55, repeat: Infinity, repeatType: 'reverse' }
                      : { type: 'spring', stiffness: 180, damping: 14 }
                  }
                  style={{ transformOrigin: '52px 38px' }}
                >
                  <polygon points="46,14 72,14 64,56 38,56" fill="#6D4BFF" />
                  <circle cx="50" cy="24" r="2.2" fill="#F8FAFC" />
                  <circle cx="60" cy="24" r="2.2" fill="#F8FAFC" />
                  <motion.circle
                    cx={50 + getPupilOffset(50, 24, 1.05, 'cross-left').x}
                    cy={24 + getPupilOffset(50, 24, 1.05, 'cross-left').y}
                    r="0.95"
                    fill="#1F2937"
                    transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                  />
                  <motion.circle
                    cx={60 + getPupilOffset(60, 24, 1.05, 'cross-right').x}
                    cy={24 + getPupilOffset(60, 24, 1.05, 'cross-right').y}
                    r="0.95"
                    fill="#1F2937"
                    transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                  />
                </motion.g>

                <motion.g
                  animate={{
                    ...getBodyOffset(24, 72, 3.2, 4),
                    ...(loginStatus === 'success' ? { y: [0, -2.1, 0], rotate: [0, -2, 3, 0] } : {}),
                    ...(loginStatus === 'error' ? { x: -1.2 } : {}),
                  }}
                  transition={
                    loginStatus === 'success'
                      ? { duration: 0.5, repeat: Infinity, repeatType: 'reverse' }
                      : { type: 'spring', stiffness: 170, damping: 15 }
                  }
                >
                  <path d="M3,100 L3,78 A21,21 0 0,1 45,78 L45,100 Z" fill="#F89968" />
                  <motion.circle
                    cx={21 + getPupilOffset(21, 78, 1.4).x}
                    cy={78 + getPupilOffset(21, 78, 1.4).y}
                    r="2.2"
                    fill="#1F2937"
                    transition={{ type: 'spring', stiffness: 280, damping: 20 }}
                  />
                  <motion.circle
                    cx={29 + getPupilOffset(29, 78, 1.4).x}
                    cy={78 + getPupilOffset(29, 78, 1.4).y}
                    r="2.2"
                    fill="#1F2937"
                    transition={{ type: 'spring', stiffness: 280, damping: 20 }}
                  />
                </motion.g>

                <motion.g
                  animate={{
                    ...getBodyOffset(54, 74, 2.9, 4.6),
                    ...(loginStatus === 'success' ? { y: [0, -3.2, 0], rotate: [0, 2, -2, 0] } : {}),
                    ...(loginStatus === 'error' ? { y: [0, -1.8, 0] } : {}),
                  }}
                  transition={
                    loginStatus === 'success'
                      ? { duration: 0.5, repeat: Infinity, repeatType: 'reverse' }
                      : loginStatus === 'error'
                        ? { duration: 0.55, repeat: Infinity, repeatType: 'reverse' }
                        : { type: 'spring', stiffness: 180, damping: 15 }
                  }
                >
                  <rect x="46" y="34" width="24" height="66" rx="2.5" fill="#4B5563" />
                  <circle cx="54" cy="46" r="2.2" fill="#F8FAFC" />
                  <circle cx="64" cy="46" r="2.2" fill="#F8FAFC" />
                  <motion.circle
                    cx={54 + getPupilOffset(54, 46, 1.05, 'cross-right').x}
                    cy={46 + getPupilOffset(54, 46, 1.05, 'cross-right').y}
                    r="0.95"
                    fill="#1F2937"
                    transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                  />
                  <motion.circle
                    cx={64 + getPupilOffset(64, 46, 1.05, 'cross-left').x}
                    cy={46 + getPupilOffset(64, 46, 1.05, 'cross-left').y}
                    r="0.95"
                    fill="#1F2937"
                    transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                  />
                </motion.g>

                <motion.g
                  animate={{
                    ...getBodyOffset(79, 78, 3.4, 4.8),
                    ...(loginStatus === 'success' ? { y: [0, -2.5, 0], rotate: [0, 3.2, -3.2, 0] } : {}),
                    ...(loginStatus === 'error' ? { rotate: 2.2 } : {}),
                  }}
                  transition={
                    loginStatus === 'success'
                      ? { duration: 0.48, repeat: Infinity, repeatType: 'reverse' }
                      : { type: 'spring', stiffness: 180, damping: 15 }
                  }
                  style={{ transformOrigin: '79px 84px' }}
                >
                  <path d="M60,100 L60,68 A19,19 0 0,1 98,68 L98,100 Z" fill="#E5D755" />
                  <motion.circle
                    cx={72 + getPupilOffset(72, 61.5, 1.45).x}
                    cy={61.5 + getPupilOffset(72, 61.5, 1.45).y}
                    r="2.3"
                    fill="#1F2937"
                    transition={{ type: 'spring', stiffness: 280, damping: 20 }}
                  />
                  <motion.circle
                    cx={84 + getPupilOffset(84, 61.5, 1.45).x}
                    cy={61.5 + getPupilOffset(84, 61.5, 1.45).y}
                    r="2.3"
                    fill="#1F2937"
                    transition={{ type: 'spring', stiffness: 280, damping: 20 }}
                  />
                  <motion.path
                    d={
                      loginStatus === 'error'
                        ? 'M68 75 C71 79, 75 71, 78 75 C81 79, 85 71, 88 75'
                        : loginStatus === 'success'
                          ? 'M68 75 C72 82, 84 82, 88 75'
                          : 'M68 75 L88 75'
                    }
                    animate={getMouthOffset(78, 75, 1.3, 6)}
                    stroke="#1F2937"
                    strokeWidth="2"
                    strokeLinecap="round"
                    fill="none"
                    transition={{ type: 'spring', stiffness: 230, damping: 18 }}
                  />
                </motion.g>

                <AnimatePresence>
                  {loginStatus === 'success' ? (
                    <motion.g
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.circle
                        cx="36"
                        cy="18"
                        r="1.3"
                        fill="#F9A8D4"
                        animate={{ y: [-1, -6, -12], opacity: [0.95, 0.8, 0] }}
                        transition={{ duration: 0.9, repeat: Infinity, ease: 'easeOut' }}
                      />
                      <motion.circle
                        cx="44"
                        cy="16"
                        r="1"
                        fill="#A78BFA"
                        animate={{ y: [0, -4, -10], opacity: [0.95, 0.8, 0] }}
                        transition={{ duration: 0.85, repeat: Infinity, delay: 0.2, ease: 'easeOut' }}
                      />
                      <motion.circle
                        cx="84"
                        cy="20"
                        r="1.2"
                        fill="#FDE047"
                        animate={{ y: [0, -4, -10], opacity: [0.95, 0.8, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: 0.1, ease: 'easeOut' }}
                      />
                    </motion.g>
                  ) : null}
                </AnimatePresence>
              </svg>
            </div>
          </div>
        </section>

        <section className="relative flex h-full items-center justify-center overflow-hidden bg-white px-6 py-4 md:px-10 md:py-5">
          <div className="pointer-events-none absolute right-10 top-10 h-28 w-28 rounded-full bg-pink-200/50 blur-2xl" />
          <div className="pointer-events-none absolute bottom-14 left-8 h-32 w-32 rounded-full bg-violet-200/45 blur-2xl" />

          <div className="relative w-full max-w-md">
            <div className="mb-4 rounded-3xl border border-pink-100 bg-gradient-to-r from-pink-50 via-rose-50 to-violet-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-pink-600">
                    <Sparkles className="h-3.5 w-3.5" />
                    Couple Space
                  </p>
                  <h1 className="mt-2 text-[30px] font-semibold tracking-tight text-gray-900">
                    Welcome back, love
                  </h1>
                  <p className="mt-1 text-sm text-gray-600">
                    记录你们每一个心动瞬间
                  </p>
                </div>
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                  className="rounded-2xl bg-white/85 p-2 text-pink-500 shadow-sm"
                >
                  <Heart className="h-5 w-5 fill-current" />
                </motion.div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                <span className="rounded-full border border-pink-200 bg-white px-2.5 py-1">
                  Mao
                </span>
                <Heart className="h-3.5 w-3.5 fill-pink-400 text-pink-400" />
                <span className="rounded-full border border-violet-200 bg-white px-2.5 py-1">
                  Pi
                </span>
              </div>
            </div>

            <div className="rounded-3xl border border-gray-100 bg-white/95 p-5 shadow-[0_24px_80px_-30px_rgba(244,114,182,0.45)] backdrop-blur">
              <AnimatePresence>
                {showCelebration ? (
                  <motion.div
                    initial={{ opacity: 0, y: 18, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.97 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="mb-5 overflow-hidden rounded-2xl border border-emerald-200 bg-emerald-50 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <motion.svg
                        viewBox="0 0 80 80"
                        className="h-14 w-14 shrink-0"
                        animate={{ rotate: [0, -6, 6, -4, 0] }}
                        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                        aria-hidden="true"
                      >
                        <rect x="18" y="18" width="44" height="44" rx="14" fill="#F472B6" />
                        <circle cx="33" cy="38" r="4.5" fill="white" />
                        <circle cx="47" cy="38" r="4.5" fill="white" />
                        <circle cx="33" cy="38" r="2" fill="#1F2937" />
                        <circle cx="47" cy="38" r="2" fill="#1F2937" />
                        <path
                          d="M30 50 C34 56, 46 56, 50 50"
                          stroke="#1F2937"
                          strokeWidth="3"
                          strokeLinecap="round"
                          fill="none"
                        />
                        <motion.path
                          d="M57 22 L66 13"
                          stroke="#1F2937"
                          strokeWidth="4"
                          strokeLinecap="round"
                          animate={{ rotate: [0, 22, 0, 22, 0] }}
                          transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
                          style={{ transformOrigin: '57px 22px' }}
                        />
                      </motion.svg>
                      <div>
                        <p className="text-sm font-semibold text-emerald-800">
                          Yay! Login successful
                        </p>
                        <p className="text-xs text-emerald-700">
                          欢迎回到你们的 PM Love 纪念空间
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
              <p className="mb-5 text-sm text-gray-500">Please enter your details</p>

              <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => {
                    handleTyping();
                    setEmail(event.target.value);
                  }}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-pink-300 focus:ring-2 focus:ring-pink-200/80"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => {
                      handleTyping();
                      setPassword(event.target.value);
                    }}
                    placeholder="Enter your password"
                    required
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-11 text-gray-900 outline-none transition focus:border-pink-300 focus:ring-2 focus:ring-pink-200/80"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-gray-700"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-600">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(event) => setRemember(event.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-pink-500 focus:ring-pink-300"
                  />
                  Remember for 30 days
                </label>
                <a href="#" className="font-medium text-gray-700 hover:text-black">
                  Forgot password?
                </a>
              </div>

              {error ? (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </p>
              ) : null}

              {success ? (
                <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {success}
                </p>
              ) : null}

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileTap={{ scale: 0.982 }}
                  className="w-full rounded-xl border border-pink-500 bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 py-3 text-sm font-semibold text-white transition hover:shadow-lg hover:shadow-pink-300/40 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Logging in...' : 'Log in'}
                </motion.button>

                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                    <path
                      d="M21.805 10.023h-9.81v3.955h5.624c-.243 1.27-.973 2.347-2.07 3.07v2.55h3.348c1.96-1.806 3.088-4.468 3.088-7.598 0-.662-.06-1.297-.18-1.977z"
                      fill="#4285F4"
                    />
                    <path
                      d="M11.995 22c2.79 0 5.13-.925 6.842-2.503l-3.348-2.55c-.925.62-2.107.985-3.494.985-2.684 0-4.962-1.812-5.776-4.256H2.76v2.67C4.462 19.73 7.977 22 11.995 22z"
                      fill="#34A853"
                    />
                    <path
                      d="M6.22 13.676a6.62 6.62 0 0 1-.324-2.066c0-.718.122-1.412.324-2.066V6.874H2.76A10.001 10.001 0 0 0 2 11.61c0 1.61.386 3.13 1.072 4.436l3.148-2.37z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M11.995 5.29c1.518 0 2.882.522 3.957 1.55l2.965-2.965C17.12 2.2 14.78 1.22 11.995 1.22c-4.018 0-7.533 2.27-9.235 5.654l3.46 2.67C7.033 7.102 9.31 5.29 11.995 5.29z"
                      fill="#EA4335"
                    />
                  </svg>
                  Log in with Google
                </button>
              </form>
            </div>

            <p className="mt-5 text-center text-sm text-gray-500">
              Don't have an account?{' '}
              <a href="#" className="font-medium text-pink-600 hover:underline">
                Sign Up
              </a>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
