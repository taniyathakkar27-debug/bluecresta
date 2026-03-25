import { useEffect, useState } from "react"

export function HeroSection() {
  const text = "Master Market Moves"
  const [displayText, setDisplayText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const typingSpeed = 100
    const deletingSpeed = 50
    const pauseDuration = 1000

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < text.length) {
          setDisplayText(text.slice(0, displayText.length + 1))
        } else {
          setTimeout(() => setIsDeleting(true), pauseDuration)
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(text.slice(0, displayText.length - 1))
        } else {
          setIsDeleting(false)
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed)

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, text])

  return (
    <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden bg-[#0A0D1A]">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-100 brightness-125"
      >
        <source src="/video/video_hero.mp4" type="video/mp4" />
      </video>
      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0D1A]/40 via-[#0A0D1A]/60 to-[#0A0D1A]" />
      
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] text-white">
              {displayText}
              <span className="animate-pulse text-primary">|</span>
            </h1>
          </div>
        </div>
      </div>
    </section>
  )
}
