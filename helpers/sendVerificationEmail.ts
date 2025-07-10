import { Resend } from 'resend';
import VerificationEmail from '@/emails/VerificationEmail'; 

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail({
  username,
  email,
  verifiedCode,
}: {
  username: string;
  email: string;
  verifiedCode: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: [email],
      subject: 'Verification Code from Anonymous Messages',
      react: VerificationEmail({ username, otp: verifiedCode }),
    });

    if (error) {
      console.error('Failed to send email:', error);
      throw new Error('Failed to send verification email');
    }

    return data; // optional
  } catch (err) {
    console.error('Error in sendVerificationEmail:', err);
    throw err;
  }
}
