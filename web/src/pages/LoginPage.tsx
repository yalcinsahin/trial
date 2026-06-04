import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, ArrowRight, CheckCircle } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';

const loginSchema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const magicLinkSchema = z.object({
  email: z.string().email('Valid email required'),
});

type LoginData = z.infer<typeof loginSchema>;
type MagicLinkData = z.infer<typeof magicLinkSchema>;

const LoginPage: React.FC = () => {
  const [mode, setMode] = useState<'password' | 'magic-link'>('password');
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const { signIn, signInWithMagicLink, isLoading, error } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') ?? '/dashboard';

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
  } = useForm<LoginData>({ resolver: zodResolver(loginSchema) });

  const {
    register: registerMagicLink,
    handleSubmit: handleMagicLinkSubmit,
    formState: { errors: magicLinkErrors },
  } = useForm<MagicLinkData>({ resolver: zodResolver(magicLinkSchema) });

  const onPasswordSignIn = async (data: LoginData) => {
    const { error: signInError } = await signIn(data.email, data.password);
    if (!signInError) {
      navigate(redirectTo);
    }
  };

  const onMagicLink = async (data: MagicLinkData) => {
    const { error: mlError } = await signInWithMagicLink(data.email);
    if (!mlError) {
      setMagicLinkSent(true);
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>Sign In — BookAirportRide</title>
        <meta name="description" content="Sign in to your BookAirportRide account." />
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="min-h-screen bg-sea-salt-50 flex items-center justify-center py-12">
        <div className="w-full max-w-md px-4">
          <div className="text-center mb-8">
            <Link to="/" className="inline-block mb-6">
              <span className="font-cinzel text-2xl font-semibold text-brand-black">
                BookAirportRide
              </span>
            </Link>
            <h1 className="font-cinzel text-3xl font-medium text-brand-black mb-2">
              Welcome Back
            </h1>
            <p className="font-cormorant text-xl text-brand-black-400">
              Sign in to your account
            </p>
          </div>

          <Card padding="lg" variant="elevated">
            {/* Mode Toggle */}
            <div className="flex mb-6 border border-sea-salt-200">
              <button
                type="button"
                onClick={() => setMode('password')}
                className={[
                  'flex-1 py-2.5 font-josefin text-xs uppercase tracking-wider transition-colors duration-200',
                  mode === 'password'
                    ? 'bg-brand-black text-warm-white'
                    : 'bg-warm-white text-brand-black-400 hover:text-brand-black',
                ].join(' ')}
              >
                Password
              </button>
              <button
                type="button"
                onClick={() => setMode('magic-link')}
                className={[
                  'flex-1 py-2.5 font-josefin text-xs uppercase tracking-wider transition-colors duration-200',
                  mode === 'magic-link'
                    ? 'bg-brand-black text-warm-white'
                    : 'bg-warm-white text-brand-black-400 hover:text-brand-black',
                ].join(' ')}
              >
                Magic Link
              </button>
            </div>

            {/* Global Error */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-100">
                <p className="font-josefin text-xs text-red-600">{error}</p>
              </div>
            )}

            {/* Password Form */}
            {mode === 'password' && (
              <form onSubmit={handlePasswordSubmit(onPasswordSignIn)} className="space-y-5">
                <Input
                  label="Email Address"
                  type="email"
                  required
                  leftIcon={<Mail className="h-4 w-4" />}
                  error={passwordErrors.email?.message}
                  {...registerPassword('email')}
                />
                <Input
                  label="Password"
                  type="password"
                  required
                  leftIcon={<Lock className="h-4 w-4" />}
                  error={passwordErrors.password?.message}
                  {...registerPassword('password')}
                />
                <div className="flex items-center justify-end">
                  <Link
                    to="/forgot-password"
                    className="font-josefin text-xs uppercase tracking-wider text-terra-cotta-500 hover:text-terra-cotta-600"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  isLoading={isLoading}
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Sign In
                </Button>
              </form>
            )}

            {/* Magic Link Form */}
            {mode === 'magic-link' && !magicLinkSent && (
              <form onSubmit={handleMagicLinkSubmit(onMagicLink)} className="space-y-5">
                <p className="font-cormorant text-lg text-brand-black-400">
                  Enter your email and we'll send a secure sign-in link — no password required.
                </p>
                <Input
                  label="Email Address"
                  type="email"
                  required
                  leftIcon={<Mail className="h-4 w-4" />}
                  error={magicLinkErrors.email?.message}
                  {...registerMagicLink('email')}
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  isLoading={isLoading}
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Send Magic Link
                </Button>
              </form>
            )}

            {/* Magic Link Sent */}
            {mode === 'magic-link' && magicLinkSent && (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-sea-salt-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-terra-cotta-500" />
                </div>
                <h3 className="font-cinzel text-xl font-medium text-brand-black mb-2">
                  Check Your Email
                </h3>
                <p className="font-cormorant text-lg text-brand-black-400">
                  We've sent a secure sign-in link to your email address. Click the link to sign in.
                </p>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-sea-salt-200 text-center">
              <p className="font-josefin text-xs text-brand-black-400 uppercase tracking-wider">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="text-terra-cotta-500 hover:text-terra-cotta-600 transition-colors"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;
