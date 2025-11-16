import { Star } from 'lucide-react';
import CelticBorder from './CelticBorder';

export default function TestimonialSection() {
  const testimonials = [
    {
      text: "The Celtic interpretations are unlike anything I've experienced. Each reading feels deeply connected to the seasons and cycles of my life.",
      author: "Sarah M.",
      rating: 5
    },
    {
      text: "I've been using SÍDHE for three months now. The daily readings have become an essential part of my morning ritual.",
      author: "Michael R.",
      rating: 5
    },
    {
      text: "The analytics feature is brilliant! I can finally see patterns in my readings across the Celtic festivals. It's given me such valuable insights.",
      author: "Emma K.",
      rating: 5
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{
          fontFamily: 'Cinzel, serif',
          color: '#d4af37',
          textShadow: '0 0 20px rgba(212, 175, 55, 0.6)'
        }}>
          Trusted by Seekers Worldwide
        </h2>
        <div className="w-32 h-1 mx-auto bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <CelticBorder key={index}>
            <div className="p-6 h-full flex flex-col">
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4"
                    fill="#d4af37"
                    stroke="#d4af37"
                  />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="flex-1 italic leading-relaxed mb-4" style={{
                color: '#f5e6d3',
                textShadow: '0 1px 2px rgba(0,0,0,0.7)',
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '1rem'
              }}>
                "{testimonial.text}"
              </p>

              {/* Author */}
              <p className="text-sm font-semibold" style={{
                color: '#cd7f32',
                fontFamily: 'Cinzel, serif'
              }}>
                — {testimonial.author}
              </p>
            </div>
          </CelticBorder>
        ))}
      </div>

      {/* Social Proof Stat */}
      <div className="text-center mt-12">
        <p className="text-lg" style={{
          color: '#d4af37',
          fontFamily: 'Cinzel, serif',
          textShadow: '0 1px 2px rgba(0,0,0,0.8)'
        }}>
          Join hundreds of seekers on their spiritual journey
        </p>
      </div>
    </div>
  );
}
