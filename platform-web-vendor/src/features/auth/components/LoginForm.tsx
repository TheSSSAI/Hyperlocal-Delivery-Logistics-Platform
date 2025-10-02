import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/features/auth/hooks/useAuth';

// Assuming these are from a shared UI component library
import { Button } from '@/shared/ui/components/Button';
import { Input } from '@/shared/ui/components/Input';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/components/Alert';
import { Loader2 } from 'lucide-react';

const mobileSchema = z.object({
  mobileNumber: z
    .string()
    .min(1, 'Mobile number is required')
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'),
});

const otpSchema = z.object({
  otp: z
    .string()
    .min(6, 'OTP must be 6 digits')
    .max(6, 'OTP must be 6 digits'),
});

type MobileFormValues = z.infer<typeof mobileSchema>;
type OtpFormValues = z.infer<typeof otpSchema>;

export const LoginForm: React.FC = () => {
  const [step, setStep] = useState<'mobile' | 'otp'>('mobile');
  const [mobileNumber, setMobileNumber] = useState('');
  const { sendOtp, verifyOtp } = useAuth();

  const mobileForm = useForm<MobileFormValues>({
    resolver: zodResolver(mobileSchema),
    mode: 'onChange',
  });

  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    mode: 'onChange',
  });

  const handleMobileSubmit = async (data: MobileFormValues) => {
    setMobileNumber(data.mobileNumber);
    await sendOtp.mutateAsync(data.mobileNumber, {
      onSuccess: () => {
        setStep('otp');
      },
    });
  };

  const handleOtpSubmit = async (data: OtpFormValues) => {
    await verifyOtp.mutateAsync({ mobileNumber, otp: data.otp });
    // On success, the useAuth hook's context will change, and ProtectedRoute will handle navigation
  };

  return (
    <div className="w-full max-w-sm">
      {step === 'mobile' && (
        <form onSubmit={mobileForm.handleSubmit(handleMobileSubmit)} className="space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Vendor Login</h1>
            <p className="text-muted-foreground">Enter your mobile number to receive an OTP.</p>
          </div>
          <Controller
            name="mobileNumber"
            control={mobileForm.control}
            render={({ field, fieldState }) => (
              <div>
                <Input
                  {...field}
                  id="mobileNumber"
                  type="tel"
                  placeholder="10-digit mobile number"
                  autoComplete="tel"
                  disabled={sendOtp.isPending}
                />
                {fieldState.error && <p className="mt-1 text-sm text-red-500">{fieldState.error.message}</p>}
              </div>
            )}
          />

          {sendOtp.isError && (
             <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{sendOtp.error.message || 'An unexpected error occurred.'}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={sendOtp.isPending || !mobileForm.formState.isValid}>
            {sendOtp.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Send OTP'}
          </Button>
        </form>
      )}

      {step === 'otp' && (
        <form onSubmit={otpForm.handleSubmit(handleOtpSubmit)} className="space-y-6">
           <div className="text-center">
            <h1 className="text-2xl font-bold">Enter OTP</h1>
            <p className="text-muted-foreground">An OTP has been sent to +91 {mobileNumber}.</p>
          </div>
          <Controller
            name="otp"
            control={otpForm.control}
            render={({ field, fieldState }) => (
              <div>
                <Input
                  {...field}
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  placeholder="6-digit OTP"
                  autoComplete="one-time-code"
                  disabled={verifyOtp.isPending}
                />
                {fieldState.error && <p className="mt-1 text-sm text-red-500">{fieldState.error.message}</p>}
              </div>
            )}
          />

          {verifyOtp.isError && (
             <Alert variant="destructive">
                <AlertTitle>Login Failed</AlertTitle>
                <AlertDescription>{verifyOtp.error.message || 'An unexpected error occurred.'}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={verifyOtp.isPending || !otpForm.formState.isValid}>
            {verifyOtp.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Verify & Login'}
          </Button>
          <div className="text-center">
             <Button variant="link" size="sm" onClick={() => { setStep('mobile'); sendOtp.reset(); }} disabled={verifyOtp.isPending}>
                Use a different number
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};