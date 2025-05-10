import type { Metadata } from "next";
// import "./globals.css";

export const metadata: Metadata = {
  title: {
    default:  "SpeakWrite",
    template: '%s | SpeakWrite',
  },
  metadataBase: new URL('https://speakwrite.goldlabel.pro'),
  description: 'From speech to campaign in 60 seconds. SpeakWrite turns your voice into a ready-to-post AI-powered media kit',
  openGraph: {
    title: 'SpeakWrite',
    description: 'From speech to campaign in 60 seconds. SpeakWrite turns your voice into a ready-to-post AI-powered media kit',
    images: [`/jpg/portrait.jpg SpeakWrite`],
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href={`/png/logo180.png`}
        />
        <link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
