
import { useState, useEffect } from "react"
import { Link } from 'react-router-dom'
import { Menu, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

const marketLinks = [
  { href: "/markets/forex", label: "Forex" },
  { href: "/markets/cfds", label: "CFDs" },
  { href: "/markets/indices", label: "Indices" },
  { href: "/markets/commodities", label: "Commodities" },
  { href: "/markets/metals", label: "Precious Metals" },
]

const accountLinks = [
  { href: "/accounts/types", label: "Account Types" },
  { href: "/accounts/deposits-withdrawals", label: "Deposits & Withdrawals" },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMarketsOpen, setIsMarketsOpen] = useState(false)
  const [isAccountsOpen, setIsAccountsOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-[#0A0D1A]/95 backdrop-blur-md border-b border-white/8" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/images/blue_cresta_logo.png"
              alt="BLUE CRESTA FX"
              width={180}
              height={50}
              className="h-14 sm:h-16 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {/* Markets Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setIsMarketsOpen(true)}
              onMouseLeave={() => setIsMarketsOpen(false)}
            >
              <div className="flex items-center gap-1 text-sm font-medium cursor-pointer transition-colors py-2 text-white hover:text-primary">
                Markets <ChevronDown className={`w-4 h-4 transition-transform ${isMarketsOpen ? "rotate-180" : ""}`} />
              </div>
              {isMarketsOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-[#0F1628] backdrop-blur-md rounded-xl shadow-lg border border-white/8 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  {marketLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className="block px-4 py-2.5 text-sm text-white hover:bg-white/10 hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            {/* Accounts Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setIsAccountsOpen(true)}
              onMouseLeave={() => setIsAccountsOpen(false)}
            >
              <div className="flex items-center gap-1 text-sm font-medium cursor-pointer transition-colors py-2 text-white hover:text-primary">
                Accounts <ChevronDown className={`w-4 h-4 transition-transform ${isAccountsOpen ? "rotate-180" : ""}`} />
              </div>
              {isAccountsOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-[#0F1628] backdrop-blur-md rounded-xl shadow-lg border border-white/8 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  {accountLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className="block px-4 py-2.5 text-sm text-white hover:bg-white/10 hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link to="/prop-firm" className="text-sm font-medium transition-colors text-white hover:text-primary">
              Prop Firm
            </Link>
            <Link to="/partnership" className="text-sm font-medium transition-colors text-white hover:text-primary">
              Partnership
            </Link>
            <Link to="/about" className="text-sm font-medium transition-colors text-white hover:text-primary">
              About Us
            </Link>
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link to="/user/login">
              <Button className="pill-button border-2 border-primary text-white hover:bg-primary hover:text-white text-sm">Log In</Button>
            </Link>
            <Link to="/user/signup">
              <Button className="pill-button pill-button-primary text-sm">
                Open Account
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-white/8 bg-[#0F1628]/95 backdrop-blur-md">
            <nav className="flex flex-col gap-2">
              <div className="py-2">
                <p className="text-xs font-semibold uppercase tracking-wider mb-2 text-primary">Markets</p>
                {marketLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="block text-sm font-medium py-2 pl-3 hover:text-primary transition-colors text-white"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="py-2">
                <p className="text-xs font-semibold uppercase tracking-wider mb-2 text-primary">Accounts</p>
                {accountLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="block text-sm font-medium py-2 pl-3 hover:text-primary transition-colors text-white"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <Link to="/prop-firm" className="block text-sm font-medium py-2 pl-3 hover:text-primary transition-colors text-white" onClick={() => setIsMobileMenuOpen(false)}>Prop Firm</Link>
              <Link to="/partnership" className="block text-sm font-medium py-2 pl-3 hover:text-primary transition-colors text-white" onClick={() => setIsMobileMenuOpen(false)}>Partnership</Link>
              <Link to="/about" className="block text-sm font-medium py-2 pl-3 hover:text-primary transition-colors text-white" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
              <div className="flex flex-col gap-3 pt-4">
                <Link to="/user/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full pill-button pill-button-outline">Log In</Button>
                </Link>
                <Link to="/user/signup" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full pill-button pill-button-primary">Open Account</Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
