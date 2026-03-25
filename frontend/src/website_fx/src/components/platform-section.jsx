import { ArrowUpRight } from "lucide-react"

export function PlatformSection() {
  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0A0D1A] mb-4 flex items-center gap-4">
            OUR APPROACH
            <ArrowUpRight className="w-8 h-8 lg:w-12 lg:h-12 text-primary" />
          </h2>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Decorative 3D Object */}
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl flex items-center justify-center overflow-hidden">
              <div className="w-64 h-64 lg:w-80 lg:h-80 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-full opacity-20 blur-3xl"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-3xl transform rotate-45 shadow-2xl"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Text Content */}
          <div>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Our methodology combines <span className="font-bold text-primary">strategic thinking</span> with practical execution. We don't just identify problems—we architect solutions that deliver measurable results.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Through collaborative workshops and deep-dive analysis, we uncover hidden opportunities and develop actionable roadmaps tailored to your business context.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Every engagement is backed by <span className="font-bold text-primary">data-driven insights</span> and industry best practices, ensuring sustainable growth and competitive advantage.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
