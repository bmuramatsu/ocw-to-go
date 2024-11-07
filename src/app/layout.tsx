import React from "react";
import Header from "./header";
import Footer from "./footer";

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <div className="page-grid--text">
      <div className="header-container">
        <Header />
      </div>
      {children}
      <Footer />
    </div>
  );
}
