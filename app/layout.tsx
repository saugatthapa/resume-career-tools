import type { Metadata } from 'next';
import './styles/globals.css';

export const metadata: Metadata = {
  title: 'Resume & Career Tools - Build Professional Resumes',
  description:
    'Create professional resumes and cover letters with our free tools. Generate AI-powered summaries, headlines, and skills suggestions.',
  keywords:
    'resume builder, cover letter generator, resume templates, AI resume tools, free resume maker',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}