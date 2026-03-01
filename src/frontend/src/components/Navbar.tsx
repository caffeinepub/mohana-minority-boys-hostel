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
    <header className="sticky top-0 z-50 nav-glass">
      {/* Top strip — tighter, more refined */}
      <div className="border-b border-white/5 py-1 px-4 text-center text-[11px] tracking-wider font-body text-white/45 uppercase">
        Government of Odisha &nbsp;·&nbsp; SC &amp; ST Development, Minorities
        &amp; Backward Classes Dept.
      </div>

      {/* Main navbar */}
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-[3.75rem]">
          {/* Logo + Name */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-[oklch(var(--saffron)/0.5)] bg-white/8 flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:border-[oklch(var(--saffron)/0.85)]">
              <img
                src="/assets/generated/odisha-emblem-transparent.png"
                alt="Odisha Emblem"
                className="w-8 h-8 object-cover"
              />
            </div>
            <div>
              <p className="text-white font-display font-bold text-[13px] leading-tight hidden sm:block tracking-tight">
                Post Matric Minority Boys Hostel
              </p>
              <p className="text-white font-display font-bold text-[13px] leading-tight sm:hidden tracking-tight">
                PMMBH Mohana
              </p>
              <p className="text-[oklch(var(--saffron)/0.8)] text-[11px] font-body hidden sm:block tracking-wide mt-0.5">
                Mohana · Gajapati · Odisha
              </p>
            </div>
          </Link>

          {/* Desktop Nav — underline-style active indicator */}
          <div className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`relative px-3.5 py-1.5 text-[13px] font-body font-medium transition-all duration-200 group ${
                  isActive(link.href)
                    ? "text-[oklch(var(--saffron))]"
                    : "text-white/75 hover:text-white"
                }`}
              >
                {link.label}
                {/* Active underline dot */}
                {isActive(link.href) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[oklch(var(--saffron))]" />
                )}
                {/* Hover underline */}
                <span
                  className={`absolute bottom-0 left-3.5 right-3.5 h-px bg-[oklch(var(--saffron)/0.4)] transition-opacity duration-200 ${isActive(link.href) ? "opacity-0" : "opacity-0 group-hover:opacity-100"}`}
                />
              </Link>
            ))}
          </div>

          {/* Admin + Mobile Toggle */}
          <div className="flex items-center gap-2">
            <Link to="/admin/login">
              <Button
                size="sm"
                className="bg-[oklch(var(--saffron)/0.15)] border border-[oklch(var(--saffron)/0.35)] text-[oklch(var(--saffron))] hover:bg-[oklch(var(--saffron))] hover:text-[oklch(0.12_0.02_260)] font-body font-semibold text-xs gap-1.5 hidden sm:flex transition-all duration-200"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin
              </Button>
            </Link>
            <button
              type="button"
              className="lg:hidden text-white/80 p-2 rounded hover:bg-white/10 hover:text-white transition-colors"
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
          <div className="lg:hidden border-t border-white/8 py-3 pb-4 space-y-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-body font-medium transition-all ${
                  isActive(link.href)
                    ? "bg-[oklch(var(--saffron)/0.12)] text-[oklch(var(--saffron))] border border-[oklch(var(--saffron)/0.25)]"
                    : "text-white/80 hover:bg-white/8 hover:text-white"
                }`}
              >
                {isActive(link.href) && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[oklch(var(--saffron))] flex-shrink-0" />
                )}
                {link.label}
              </Link>
            ))}
            <Link
              to="/admin/login"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 mt-2 bg-[oklch(var(--saffron)/0.15)] border border-[oklch(var(--saffron)/0.3)] text-[oklch(var(--saffron))] rounded-lg text-sm font-body font-semibold"
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
