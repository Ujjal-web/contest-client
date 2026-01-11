import { UserPlus, Search, Award, Gift } from 'lucide-react';

const steps = [
  {
    icon: <UserPlus size={40} />,
    title: 'Create an Account',
    description: 'Sign up for a free account to get started.',
  },
  {
    icon: <Search size={40} />,
    title: 'Find a Contest',
    description: 'Browse through our wide range of contests and find one that matches your skills.',
  },
  {
    icon: <Award size={40} />,
    title: 'Participate & Compete',
    description: 'Submit your entry and compete with other talented participants.',
  },
  {
    icon: <Gift size={40} />,
    title: 'Win Prizes',
    description: 'Win amazing prizes and get recognized for your work.',
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-2">How It Works</h2>
        <p className="text-center text-gray-600 mb-8">
          A simple guide to getting started on our platform.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center items-center mb-4 text-primary">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
