import { Button } from "@/components/ui/button";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, ShieldCheck, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/staff", label: "Staff" },
  { href: "/admission", label: "Admission" },
  { href: "/students", label: "Students" },
  { href: "/fees", label: "Fees" },
  { href: "/scholarship", label: "Scholarship" },
  { href: "/gallery", label: "Gallery" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 navy-gradient shadow-navy">
      {/* Top strip */}
      <div className="bg-[oklch(0.14_0.07_258)] py-1 px-4 text-center text-xs text-[oklch(0.80_0.06_240)]">
        Government of Odisha — Welfare of SC & ST Development &amp; Minorities
        &amp; Backward Classes Dept.
      </div>

      {/* Main navbar */}
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Name */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[oklch(var(--saffron))] bg-white/10 flex items-center justify-center flex-shrink-0">
              <img
                src="/assets/generated/odisha-emblem-transparent.png"
                alt="Odisha Emblem"
                className="w-9 h-9 object-cover"
              />
            </div>
            <div>
              <p className="text-white font-display font-bold text-sm leading-tight hidden sm:block">
                Post Matric Minority Boys Hostel
              </p>
              <p className="text-white font-display font-bold text-sm leading-tight sm:hidden">
                PMMBH Mohana
              </p>
              <p className="text-[oklch(var(--saffron))] text-xs font-body hidden sm:block">
                Mohana, Gajapati, Odisha
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-3 py-1.5 rounded text-sm font-body font-medium transition-all duration-200 ${
                  isActive(link.href)
                    ? "bg-[oklch(var(--saffron))] text-[oklch(0.12_0.02_260)]"
                    : "text-white/90 hover:bg-white/10 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Admin + Mobile Toggle */}
          <div className="flex items-center gap-2">
            <Link to="/admin/login">
              <Button
                size="sm"
                className="bg-[oklch(var(--saffron))] text-[oklch(0.12_0.02_260)] hover:bg-[oklch(0.65_0.16_65)] font-body font-semibold text-xs gap-1.5 hidden sm:flex"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin
              </Button>
            </Link>
            <button
              type="button"
              className="lg:hidden text-white p-2 rounded hover:bg-white/10 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle mobile menu"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-white/10 py-3 pb-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-2.5 rounded text-sm font-body font-medium transition-all ${
                  isActive(link.href)
                    ? "bg-[oklch(var(--saffron))] text-[oklch(0.12_0.02_260)]"
                    : "text-white/90 hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/admin/login"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 mt-2 bg-[oklch(var(--saffron))] text-[oklch(0.12_0.02_260)] rounded text-sm font-body font-semibold"
            >
              <ShieldCheck className="w-4 h-4" />
              Admin Login
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
