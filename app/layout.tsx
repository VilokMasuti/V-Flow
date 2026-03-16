import { auth } from "@/auth";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import localFont from "next/font/local";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import "./globals.css";

// ─── Fonts ────────────────────────────────────────────────────────────────────

const inter = localFont({
  src: "./fonts/InterVF.ttf",
  variable: "--font-inter",
  weight: "100 200 300 400 500 700 800 900",
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

export const metadata: Metadata = {
  title: "DevFlow",
  description:
    "A community-driven platform for asking and answering programming questions. " +
    "Get help, share knowledge, and collaborate with developers from around the world.",
  icons: { icon: "images/logo.png" },
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
        cabinet.variable,        // --font-clash   → utility: font-clash
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
      <body className="font-satoshi bg-background text-foreground">
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
          </ThemeProvider>
          <Toaster richColors position="bottom-right" />
        </SessionProvider>
      </body>
    </html>
  );
};

export default RootLayout;