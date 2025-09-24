import React from "react";
import Header from "./header";
import Footer from "./footer";

interface Props {
  children: React.ReactNode;
  footer?: boolean;
  className?: string;
}

export default function Layout({
  children,
  footer = true,
  className = "",
}: Props) {
  return (
    <div className={`page-grid ${className}`}>
      <div className="header-container">
        <Header />
      </div>
      {children}
      {footer && <Footer />}
    </div>
  );
}
