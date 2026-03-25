import { Coins, Share2, Users2, Briefcase } from "lucide-react"

const features = [
  {
    icon: Coins,
    title: "Stagnant Growth?",
    description: "Break through revenue plateaus with data-driven strategies and market positioning.",
    number: "01",
  },
  {
    icon: Share2,
    title: "Operational Inefficiencies?",
    description: "Streamline processes and optimize workflows for maximum productivity.",
    number: "02",
  },
  {
    icon: Users2,
    title: "Market Challenges?",
    description: "Navigate complex markets with expert analysis and competitive insights.",
    number: "03",
  },
]

export function FeaturesSection() {
  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0A0D1A] mb-4">
            Are You Running Into These Problems?
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white card-rounded p-8 border border-gray-200 hover:shadow-xl transition-all duration-300"
            >
              <div className="text-sm font-bold text-primary mb-4">{feature.number}</div>
              <h3 className="text-xl font-bold text-[#0A0D1A] mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
