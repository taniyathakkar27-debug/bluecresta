import { useState } from "react"
import { ArrowRight, ChevronRight, ChevronDown, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

const services = [
  {
    title: "Customized Strategy Development",
    description: "Tailor-made strategic frameworks designed to align with your unique business objectives and market positioning.",
  },
  {
    title: "Operational Efficiency Optimization",
    description: "Streamline workflows, reduce costs, and maximize productivity through data-driven process improvements.",
  },
  {
    title: "Market Analysis and Insights",
    description: "Gain competitive advantage with deep market research, trend analysis, and actionable intelligence.",
  },
  {
    title: "Leadership and Team Building",
    description: "Build high-performing teams and develop leadership capabilities that drive sustained organizational growth.",
  },
]

export function MarketAccessSection() {
  const [expandedIndex, setExpandedIndex] = useState(null)

  const toggleAccordion = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  return (
    <section className="section-padding bg-[#0A0D1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            WHAT WE CAN DO <span className="text-primary">FOR YOU?</span>
          </h2>
        </div>

        {/* Service Accordion */}
        <div className="space-y-4 mb-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-[#0F1628] border border-white/8 card-rounded overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full flex items-center gap-4 lg:gap-6 p-6 lg:p-8 text-left hover:bg-[#151D35] transition-colors"
              >
                <div className="flex-shrink-0">
                  <ChevronRight className={`w-6 h-6 text-primary transition-transform duration-300 ${expandedIndex === index ? 'rotate-90' : ''}`} />
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-white">{service.title}</h3>
              </button>
              
              {/* Expandable Content */}
              <div className={`overflow-hidden transition-all duration-300 ${expandedIndex === index ? 'max-h-96' : 'max-h-0'}`}>
                <div className="px-6 lg:px-8 pb-6 lg:pb-8 pl-16 lg:pl-20">
                  <p className="text-[#8A94B0] leading-relaxed">{service.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Bar */}
        <div className="bg-primary card-rounded p-6 lg:p-8 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="text-center lg:text-left">
            <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2">Free consultation</h3>
            <p className="text-white/80 text-sm">Get expert insights tailored to your business</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Button className="pill-button bg-white text-primary hover:bg-white/90 whitespace-nowrap">
              SCHEDULE A FREE CALL <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
            <span className="text-white/80 text-sm">worth 200 USD</span>
          </div>
        </div>
      </div>
    </section>
  )
}
