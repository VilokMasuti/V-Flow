import { auth } from "@/auth";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import localFont from "next/font/local";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import "./globals.css";

// ─── Fonts ────────────────────────────────────────────────────────────────────

 import { DM_Sans, Inter } from "next/font/google";

   const inter = Inter({
     subsets: ["latin"],
     variable: "--font-inter",
     weight: ["400", "500", "600", "700"],
   });
   const dmSans = DM_Sans({
     subsets: ["latin"],
     variable: "--font-dm-sans",
     weight: ["400", "500", "600"],
   });



const spaceGrotesk = localFont({
  src: "./fonts/SpaceGroteskVF.ttf",
  variable: "--font-space-grotesk",
  weight: "300 400 500 700",
});

const satoshi = localFont({
  src: "./fonts/Satoshi-Variable.ttf",
  variable: "--font-satoshi",
  weight: "300 400 500 700 900",
});

const cabinet = localFont({
  src: "./fonts/CabinetGrotesk-Variable.ttf",
  variable: "--font-clash",   // ← keep the SAME variable name
  weight: "300 400 500 600 700 800 900",
});


// ─── Metadata ─────────────────────────────────────────────────────────────────

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "DevFlow",
  description: "A community-driven platform for asking and answering programming questions.",
  icons: { icon: "/images/logo.png" },
  openGraph: {
    title: "DevFlow | Ask & Answer Programming Questions",
    description: "Get help, share knowledge, and collaborate with developers worldwide.",
    url: siteUrl,
    siteName: "DevFlow",
    images: [{ url: "/images/logo.png", width: 1200, height: 630, alt: "DevFlow" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevFlow | Ask & Answer Programming Questions",
    description: "Get help, share knowledge, and collaborate with developers worldwide.",
    images: ["/images/logo.png"],
  },
  robots: { index: true, follow: true },
};


// ─── Layout ───────────────────────────────────────────────────────────────────

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={[
        inter.variable,        // --font-inter
        spaceGrotesk.variable, // --font-space-grotesk
        satoshi.variable,      // --font-satoshi → utility: font-satoshi
        cabinet.variable,
        dmSans.variable,        // --font-dm-sans
        "antialiased",
      ].join(" ")}
    >
      <head>
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css"
        />
      </head>
      <body className="  bg-neutral-950  text-foreground">
        {/*    ↑ Critical — sets Satoshi as the default for the entire app.
               Without this, body text falls back to the system font.
               font-clash only needs to be applied per-element on headings. */}
        <SessionProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
             <Analytics/>
          </ThemeProvider>
          <Toaster richColors position="bottom-right" />
        </SessionProvider>
      </body>
    </html>
  );
};

export default RootLayout;
