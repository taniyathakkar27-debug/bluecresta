import { Link } from 'react-router-dom'
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="bg-[#0A0D1A] text-white">
      {/* Contact Section */}
      <div className="border-b border-white/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left - Contact Heading */}
            <div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                CONTACT US <span className="text-primary">TODAY</span>
              </h2>
              <p className="text-lg text-[#8A94B0] mb-8">
                Ready to transform your business? Get in touch with our team of experts.
              </p>
              
              {/* Contact Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-white">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-white">contact@bluecrestafx.com</span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <span className="text-white">123 Business Ave, Suite 456<br />New York, NY 10001</span>
                </div>
              </div>

              {/* Social Media */}
              <div className="flex gap-3 mt-8">
                {[Twitter, Facebook, Linkedin, Instagram].map((Icon, index) => (
                  <Link
                    key={index}
                    to="#"
                    className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center hover:bg-primary hover:border-primary transition-all"
                  >
                    <Icon className="w-5 h-5" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Right - Contact Form */}
            <div className="bg-[#0F1628] border border-white/8 card-rounded p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Send us a message</h3>
              <form className="space-y-4">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full px-5 py-3.5 rounded-xl bg-[#0A0D1A] border border-white/10 text-white placeholder:text-[#8A94B0] focus:outline-none focus:border-primary transition-colors"
                />
                <textarea
                  placeholder="Your message"
                  rows={4}
                  className="w-full px-5 py-3.5 rounded-xl bg-[#0A0D1A] border border-white/10 text-white placeholder:text-[#8A94B0] focus:outline-none focus:border-primary transition-colors resize-none"
                />
                <Button className="pill-button pill-button-primary w-full">
                  GET IN TOUCH <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

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
