import "./globals.css";
import ServiceWorkerRegister from "./components/ServiceWorkerRegister";

export const metadata = {
  title: "Kazilen: Electrician, Plumber, AC and Carpenter Services",
  description: "Book verified electricians, plumbers, AC technicians and carpenters. Upfront rates, 30 to 45 minute ASAP dispatch, live OTP verification.",
  manifest: "/manifest.json",
  icons: { apple: "/icons/icon-192x192.png" },
  appleWebApp: { capable: true, title: "Kazilen", statusBarStyle: "default" },
  openGraph: {
    title: "Kazilen: Verified home services at your doorstep",
    description: "Upfront rates, verified pros and 30 to 45 minute dispatch.",
    type: "website",
  },
};

export const viewport = {
  themeColor: "#ff8a4c",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}