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

  const leaders = [
    {
      img: "/assets/generated/india-pm.dim_200x200.jpg",
      name: "Shri Narendra Modi",
      role: "Prime Minister of India",
    },
    {
      img: "/assets/generated/minority-minister.dim_200x200.jpg",
      name: "Shri Kiren Rijiju",
      role: "Minister of Minority Affairs",
    },
    {
      img: "/assets/uploads/images-88--1.jpeg",
      name: "Shri Mohan Charan Majhi",
      role: "Chief Minister of Odisha",
    },
    {
      img: "/assets/generated/obc-director-jugaleswari-dash.dim_300x300.jpg",
      name: "Smt Jugaleswari Dash",
      role: "OBC Director, Odisha",
    },
  ];

  return (
    <header className="sticky top-0 z-50 nav-glass">
      {/* Leaders top bar */}
      <div
        className="border-b py-1.5 px-4"
        style={{
          background:
            "linear-gradient(90deg, oklch(0.12 0.07 260 / 0.98) 0%, oklch(0.16 0.08 258 / 0.98) 100%)",
          borderColor: "oklch(0.72 0.18 58 / 0.2)",
        }}
      >
        <div className="container mx-auto flex items-center justify-center gap-1 sm:gap-6 overflow-x-auto scrollbar-none">
          {leaders.map((leader) => (
            <div
              key={leader.name}
              className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0"
            >
              <div
                className="w-7 h-7 rounded-full overflow-hidden border-2 flex-shrink-0"
                style={{ borderColor: "oklch(0.72 0.18 58 / 0.6)" }}
              >
                <img
                  src={leader.img}
                  alt={leader.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="hidden sm:block leading-none">
                <p
                  className="text-[10px] font-display font-semibold leading-tight"
                  style={{ color: "oklch(0.95 0.01 240)" }}
                >
                  {leader.name}
                </p>
                <p
                  className="text-[9px] font-body leading-tight"
                  style={{ color: "oklch(0.72 0.18 58 / 0.8)" }}
                >
                  {leader.role}
                </p>
              </div>
              {/* Mobile: name only */}
              <p
                className="sm:hidden text-[9px] font-body"
                style={{ color: "oklch(0.72 0.18 58 / 0.85)" }}
              >
                {leader.name.replace("Shri ", "").replace("Smt ", "")}
              </p>
              <span
                className="text-[oklch(0.72_0.18_58/0.25)] text-xs last:hidden"
                aria-hidden
              >
                |
              </span>
            </div>
          ))}
        </div>
      </div>

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
            <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-[oklch(var(--saffron)/0.6)] bg-white/5 flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:border-[oklch(var(--saffron))] group-hover:shadow-[0_0_12px_oklch(var(--saffron)/0.4)] shadow-[0_0_6px_oklch(var(--saffron)/0.2)]">
              <img
                src="/assets/generated/hostel-logo-transparent.dim_200x200.png"
                alt="PMMBH Mohana Logo"
                className="w-10 h-10 object-cover rounded-full"
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
