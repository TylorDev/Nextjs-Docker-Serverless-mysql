import Navbar from "@/components/Navbar";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-5rem)] w-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
