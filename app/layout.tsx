import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "WASSCE Maths Academy | Mathematics made simple",
  description: "Learn WASSCE Core Mathematics with clear lessons, practice questions and mock exams.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        <main>{children}</main>
        <footer className="footer">
          <div className="container footer-inner">
            <div><strong>WASSCE MATHS ACADEMY</strong><p>Making Mathematics Simple. Building WASSCE Confidence.</p></div>
            <span>© {new Date().getFullYear()} WASSCE Maths Academy</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
