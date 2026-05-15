"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  FileSearch,
  History,
  CreditCard,
  LogOut,
  Brain,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Analyze Resume", href: "/analyze", icon: FileSearch },
  { label: "History", href: "/history", icon: History },
  { label: "Billing", href: "/billing", icon: CreditCard },
];

export default function Sidebar({ user }: { user: any }) {
  const pathname = usePathname();

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Brain className="text-blue-500" size={24} />
          <span className="text-white font-bold text-xl">ResumeIQ</span>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-800">
        <p className="text-white font-medium text-sm truncate">{user.name}</p>
        <p className="text-gray-400 text-xs truncate">{user.email}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            user.plan === "PRO"
              ? "bg-blue-500/20 text-blue-400"
              : "bg-gray-700 text-gray-400"
          }`}>
            {user.plan}
          </span>
          <span className="text-xs text-gray-400">{user.credits} credits</span>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Sign Out */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition w-full"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );
}