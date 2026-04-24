import type { Metadata } from 'next';
import './styles/globals.css';
import { AuthProvider } from '@/contexts/AuthContext';

export const metadata: Metadata = {
  title: 'ResumeCraft - Build Professional Resumes That Get Hired',
  description: 'Create professional resumes and cover letters in minutes with our AI-powered builder. No design skills needed.',
  keywords: 'resume builder, cover letter generator, resume templates, AI resume tools, free resume maker',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}