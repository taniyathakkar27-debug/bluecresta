import { Quote } from "lucide-react"

const testimonials = [
  {
    quote: "Working with this team transformed our business strategy. Revenue increased 40% in just 6 months through their data-driven approach and market insights.",
    name: "Sarah Mitchell",
    title: "CEO",
    company: "TechVentures Inc",
    featured: true,
  },
  {
    quote: "The operational efficiency improvements were remarkable. We reduced costs by 25% while improving team productivity across all departments.",
    name: "James Rodriguez",
    title: "Operations Director",
    company: "Global Solutions Ltd",
    featured: false,
  },
  {
    quote: "Their strategic consulting helped us navigate a complex market transition. The results exceeded our expectations and positioned us as industry leaders.",
    name: "Emily Chen",
    title: "Founder",
    company: "Innovation Labs",
    featured: false,
  },
]

export function AwardsSection() {
  return (
    <section className="section-padding bg-[#0A0D1A] relative overflow-hidden">
      {/* Ghost Heading Background */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 text-[120px] lg:text-[200px] font-bold text-white/5 whitespace-nowrap pointer-events-none">
        CLIENT SUCCESS
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">TESTIMONIALS</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Client <span className="text-primary">Success Stories</span>
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`card-rounded p-8 ${
                testimonial.featured
                  ? "bg-primary"
                  : "bg-[#0F1628] border border-white/8"
              }`}
            >
              <Quote className={`w-10 h-10 mb-6 ${testimonial.featured ? "text-white/80" : "text-primary"}`} />
              <p className={`text-base lg:text-lg mb-6 leading-relaxed ${testimonial.featured ? "text-white" : "text-[#8A94B0]"}`}>
                "{testimonial.quote}"
              </p>
              <div className={`border-t pt-4 ${testimonial.featured ? "border-white/20" : "border-white/8"}`}>
                <div className={`font-bold ${testimonial.featured ? "text-white" : "text-white"}`}>
                  {testimonial.name}
                </div>
                <div className={`text-sm ${testimonial.featured ? "text-white/80" : "text-[#8A94B0]"}`}>
                  {testimonial.title} • {testimonial.company}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
