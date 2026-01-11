import { Link } from 'react-router-dom';

const CtaSection = () => {
  return (
    <section className="py-12 bg-primary text-primary-content">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="mb-8 text-primary-content/90">
          Sign up now and start your journey with us.
        </p>
        <Link
          to="/register"
          className="bg-base-100 text-primary font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-base-200 transition-colors"
        >
          Sign Up Now
        </Link>
      </div>
    </section>
  );
};

export default CtaSection;
