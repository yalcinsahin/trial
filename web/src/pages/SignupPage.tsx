import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';

const signupSchema = z
  .object({
    full_name: z.string().min(2, 'Full name required'),
    email: z.string().email('Valid email required'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Must contain at least one number'),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  });

type SignupData = z.infer<typeof signupSchema>;

const SignupPage: React.FC = () => {
  const { signUp, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupData>({ resolver: zodResolver(signupSchema) });

  const onSubmit = async (data: SignupData) => {
    const { error: signUpError } = await signUp(data.email, data.password, {
      full_name: data.full_name,
      role: 'passenger',
    });
    if (!signUpError) {
      navigate('/dashboard');
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>Create Account — BookAirportRide</title>
        <meta name="description" content="Create your BookAirportRide account to manage bookings, save addresses, and more." />
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
              Create Account
            </h1>
            <p className="font-cormorant text-xl text-brand-black-400">
              Join thousands of frequent travelers
            </p>
          </div>

          <Card padding="lg" variant="elevated">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-100">
                <p className="font-josefin text-xs text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Input
                label="Full Name"
                type="text"
                required
                leftIcon={<User className="h-4 w-4" />}
                error={errors.full_name?.message}
                {...register('full_name')}
              />
              <Input
                label="Email Address"
                type="email"
                required
                leftIcon={<Mail className="h-4 w-4" />}
                error={errors.email?.message}
                {...register('email')}
              />
              <Input
                label="Password"
                type="password"
                required
                leftIcon={<Lock className="h-4 w-4" />}
                hint="Min 8 characters, 1 uppercase, 1 number"
                error={errors.password?.message}
                {...register('password')}
              />
              <Input
                label="Confirm Password"
                type="password"
                required
                leftIcon={<Lock className="h-4 w-4" />}
                error={errors.confirm_password?.message}
                {...register('confirm_password')}
              />

              <p className="font-josefin text-[10px] uppercase tracking-wider text-brand-black-400">
                By creating an account, you agree to our{' '}
                <Link to="/terms" className="text-terra-cotta-500 hover:text-terra-cotta-600">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-terra-cotta-500 hover:text-terra-cotta-600">
                  Privacy Policy
                </Link>
                .
              </p>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isLoading}
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Create Account
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-sea-salt-200 text-center">
              <p className="font-josefin text-xs text-brand-black-400 uppercase tracking-wider">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-terra-cotta-500 hover:text-terra-cotta-600 transition-colors"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default SignupPage;
