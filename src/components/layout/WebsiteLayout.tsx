import React from "react";
import WebsiteHeader from "./WebsiteHeader";
import WebsiteFooter from "./WebsiteFooter";

export default function WebsiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f7fafc] to-[#e6ecf7] relative">
      {/* Website Header */}
      <WebsiteHeader />

      {/* Ana İçerik */}
      <main className="flex-1 w-full max-w-full">{children}</main>

      {/* Footer */}
      <WebsiteFooter />
    </div>
  );
}
