import "./globals.css";

export const metadata = {
  title: "Kazilen Customer",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}