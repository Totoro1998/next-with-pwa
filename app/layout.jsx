import "./globals.css";
import { siteConfig } from "@/lib/site-config";
import SplashScreens from "@/lib/splash-screens";
import ProvidersWrapper from "./ProvidersWrapper";
import LockScreen from "@/components/LockScreen";

export const metadata = {
  metadataBase: siteConfig.url,
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: siteConfig.authors,
  generator: "Next.js",
  keywords: siteConfig.keywords,
  creator: siteConfig.creator,
  publisher: "Vercel",
  robots: "index,follow",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: siteConfig.name,
    // startupImage: ["/screens/iPhone_8__iPhone_7__iPhone_6s__iPhone_6__4.7__iPhone_SE_landscape.png"],
    startupImage: SplashScreens,
  },
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  shortcut: ["/icons/icon-48x48.png"],
  apple: [{ url: "/icons/icon-144x144.png" }, { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" }],
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: siteConfig.themeColor,
  // Uncomment the following line to prevent zooming on mobile devices. Disallowing user scaling is not considered 'accessible', but could arguably lead to a better user experience.
  // userScalable: false,
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className="notranslate" translate="no">
      <body>
        <ProvidersWrapper>
          <LockScreen>
            <div className="mx-auto max-w-[414px] min-h-full">{children}</div>
          </LockScreen>
        </ProvidersWrapper>
      </body>
    </html>
  );
}
