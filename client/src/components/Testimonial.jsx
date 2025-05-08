import { Star, StarHalf } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Marketing Director",
    rating: 5,
    quote:
      "Working with this team has been an absolute game-changer for our business. Their attention to detail and innovative solutions have helped us achieve remarkable results.",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Tech Entrepreneur",
    rating: 4.5,
    quote:
      "The level of professionalism and expertise demonstrated by this team is outstanding. They've consistently delivered beyond our expectations.",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Product Manager",
    rating: 5,
    quote:
      "I've worked with many teams over the years, but none have matched the dedication and skill level I've experienced here. Truly exceptional service.",
  },
];

const RatingStars = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div className="flex">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      ))}
      {hasHalfStar && (
        <StarHalf className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      )}
    </div>
  );
};

function Testimonial() {
  return (
    <section className="py-12 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            What Our Clients Say
          </h2>
          <p className="text-gray-600 mt-2">Hear from our satisfied clients</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white p-6 rounded-lg shadow-sm"
            >
              <p className="text-gray-700 text-sm mb-4">
                "{testimonial.quote}"
              </p>

              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                  {testimonial.name.charAt(0)}
                </div>
                <div className="ml-3">
                  <h3 className="font-medium text-sm">{testimonial.name}</h3>
                  <p className="text-gray-500 text-xs">{testimonial.role}</p>
                  <RatingStars rating={testimonial.rating} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonial;
