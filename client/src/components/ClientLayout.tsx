"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, History, LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";
import Logo from "@/components/Logo";

function Navbar() {
  const { logout, user } = useAuth();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  
  if (!user) return null;

  const navLinks = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "History", href: "/history", icon: History },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link href="/" className="flex items-center space-x-3 group">
            <Logo size="md" />
            <span className="text-2xl font-black text-gray-900 tracking-tight">TabGuardian</span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href} 
                className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                  isActive(link.href) 
                  ? "bg-blue-50 text-blue-600" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <link.icon className={`h-4 w-4 ${isActive(link.href) ? "stroke-[3]" : "stroke-[2.5]"}`} />
                <span>{link.name}</span>
              </Link>
            ))}
            
            <div className="h-6 w-px bg-gray-100 mx-4"></div>
            
            <button 
              onClick={logout}
              className="flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all duration-200 cursor-pointer"
            >
              <LogOut className="h-4 w-4 stroke-[3]" />
              <span>Logout</span>
            </button>
          </div>

          <div className="md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-2xl bg-gray-50 text-gray-900 hover:bg-gray-100 transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden absolute top-20 inset-x-0 bg-white border-b border-gray-100 shadow-2xl animate-in slide-in-from-top duration-200">
          <div className="px-4 pt-4 pb-8 space-y-2">
            {navLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-4 px-6 py-4 rounded-2xl text-lg font-bold transition-all ${
                  isActive(link.href) 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-200" 
                  : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <link.icon className="h-6 w-6" />
                <span>{link.name}</span>
              </Link>
            ))}
            <button 
              onClick={() => { logout(); setIsOpen(false); }}
              className="w-full flex items-center space-x-4 px-6 py-4 rounded-2xl text-lg font-bold text-red-500 hover:bg-red-50 transition-all"
            >
              <LogOut className="h-6 w-6" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

function Footer() {
  return (
    <footer className="mt-auto py-6 border-t border-gray-100 bg-white/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm font-bold text-gray-400 flex items-center justify-center space-x-2">
          <span>Built with</span>
          <Heart className="h-4 w-4 text-red-500 fill-current animate-pulse" />
          <span>by</span>
          <span className="text-gray-900 font-black tracking-tight hover:text-blue-600 transition-colors cursor-default">Ravishankar K S</span>
        </p>
      </div>
    </footer>
  );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Toaster 
        position="top-center" 
        toastOptions={{
          className: 'font-bold text-sm rounded-2xl border-2 border-gray-50 shadow-2xl p-4',
          duration: 4000,
        }} 
      />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {children}
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
