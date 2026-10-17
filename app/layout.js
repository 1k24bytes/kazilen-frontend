import "./globals.css";
import ServiceWorkerRegister from "./components/ServiceWorkerRegister";

export const metadata = {
  title: "Kazilen",
  description: "Local verified professionals",
  manifest: "/manifest.json",
  icons: { apple: "/icons/icon-192x192.png" },
  appleWebApp: { capable: true, title: "Kazilen", statusBarStyle: "default" },
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