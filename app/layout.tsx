import type { Metadata } from "next";
import "./globals.css";
;

export const metadata: Metadata = {
  title: "SpeakWrite",
  description: "SpeakWrite is a privacy-first voice transcription web app that lets you record short voice notes, transcribe them instantly with AI, and review your past activity — all from your mobile browser. No installs, just clear voice to text.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
