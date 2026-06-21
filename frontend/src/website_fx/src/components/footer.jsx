import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="bg-[#0A0D1A] text-white">
      {/* Footer Bottom */}
      <div className="border-t border-white/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-6">
              <Link to="/legal/privacy-policy" className="text-sm text-white/60 hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/legal/terms-and-conditions" className="text-sm text-white/60 hover:text-primary transition-colors">
                Terms & Conditions
              </Link>
              <Link to="/legal/risk-disclosure" className="text-sm text-white/60 hover:text-primary transition-colors">
                Risk Disclosure
              </Link>
            </div>
            <p className="text-sm text-white/40">
              © {new Date().getFullYear()} Bluecrestafx. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
