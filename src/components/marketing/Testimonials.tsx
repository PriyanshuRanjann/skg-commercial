import { FaStar } from "react-icons/fa";

type Testimonial = { name: string; text: string; rating: number };

// Real testimonials go here once available from the owner.
// Until then this section is hidden so the page doesn't show fake reviews.
const testimonials: Testimonial[] = [];

export default function Testimonials() {
  if (testimonials.length === 0) return null;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-primary-blue mb-12">
          What Our Customers Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-light-gray rounded-xl p-6 shadow-sm"
            >
              <div className="flex gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FaStar
                    key={i}
                    className={
                      i < t.rating ? "text-primary-orange" : "text-gray-300"
                    }
                  />
                ))}
              </div>
              <p className="text-gray-600 text-sm mb-4 italic">
                &ldquo;{t.text}&rdquo;
              </p>
              <p className="font-semibold text-primary-blue">{t.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
