import { Link } from "@tanstack/react-router";
import { ExternalLink, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(window.location.hostname);

  return (
    <footer className="navy-gradient text-white/90 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-[oklch(var(--saffron))] bg-white/10 flex items-center justify-center">
                <img
                  src="/assets/generated/odisha-emblem-transparent.png"
                  alt="Odisha Emblem"
                  className="w-7 h-7 object-cover"
                />
              </div>
              <h3 className="font-display font-bold text-sm text-[oklch(var(--saffron))]">
                PMMBH Mohana
              </h3>
            </div>
            <p className="text-xs text-white/70 font-body leading-relaxed">
              Post Matric Minority Boys Hostel, Mohana is a Government of Odisha
              initiative providing free accommodation and educational support to
              minority students.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-[oklch(var(--saffron))] mb-4 text-sm uppercase tracking-wide">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { href: "/admission", label: "Admission" },
                { href: "/fees", label: "Fees Structure" },
                { href: "/scholarship", label: "Scholarship Portal" },
                { href: "/staff", label: "Our Staff" },
                { href: "/gallery", label: "Photo Gallery" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-xs text-white/70 hover:text-[oklch(var(--saffron))] transition-colors font-body"
                  >
                    → {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-semibold text-[oklch(var(--saffron))] mb-4 text-sm uppercase tracking-wide">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-xs text-white/70 font-body">
                <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-[oklch(var(--saffron))]" />
                Post Matric Minority Boys Hostel,
                <br />
                Mohana, Gajapati District,
                <br />
                Odisha — 761015
              </li>
              <li className="flex items-center gap-2 text-xs text-white/70 font-body">
                <Phone className="w-3.5 h-3.5 flex-shrink-0 text-[oklch(var(--saffron))]" />
                +91 9876543210
              </li>
              <li className="flex items-center gap-2 text-xs text-white/70 font-body">
                <Mail className="w-3.5 h-3.5 flex-shrink-0 text-[oklch(var(--saffron))]" />
                pmmbh.mohana@odisha.gov.in
              </li>
            </ul>
            <div className="flex flex-col gap-2 mt-4">
              <a
                href="https://scholarship.odisha.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-[oklch(var(--saffron))] hover:underline font-body"
              >
                <ExternalLink className="w-3 h-3" />
                Odisha Scholarship Portal
              </a>
              <a
                href="https://stsc.odisha.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-[oklch(var(--saffron))] hover:underline font-body"
                data-ocid="footer.link"
              >
                <ExternalLink className="w-3 h-3" />
                ST &amp; SC Dev. Dept., Odisha
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 text-center text-xs text-white/40 font-body">
          <p>
            © {year} Post Matric Minority Boys Hostel, Mohana. Government of
            Odisha. <span className="mx-2">|</span>
            Built with ♥ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[oklch(var(--saffron))] hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
