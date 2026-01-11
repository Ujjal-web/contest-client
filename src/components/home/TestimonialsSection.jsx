import { Star } from 'lucide-react';

const testimonials = [
  {
    quote: 'This is the best platform for creative contests! I have won several prizes and got amazing exposure.',
    name: 'John Doe',
    role: 'Graphic Designer',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    quote: 'I love the variety of contests available. There is something for everyone.',
    name: 'Jane Smith',
    role: 'Writer',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    quote: 'The community is amazing and the support is top-notch. Highly recommended!',
    name: 'Samuel Green',
    role: 'Photographer',
    avatar: 'https://randomuser.me/api/portraits/men/56.jpg',
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-2">What Our Users Say</h2>
        <p className="text-center text-gray-600 mb-8">
          Testimonials from our happy users.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <h3 className="text-lg font-semibold">{testimonial.name}</h3>
                  <p className="text-gray-600">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">"{testimonial.quote}"</p>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} className="text-yellow-500 fill-current" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
