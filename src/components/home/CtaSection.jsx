import { Link } from 'react-router-dom';

const CtaSection = () => {
  return (
    <section className="py-12 bg-primary text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="mb-8">
          Sign up now and start your journey with us.
        </p>
        <Link
          to="/register"
          className="bg-white text-primary font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-gray-200 transition-colors"
        >
          Sign Up Now
        </Link>
      </div>
    </section>
  );
};

export default CtaSection;
