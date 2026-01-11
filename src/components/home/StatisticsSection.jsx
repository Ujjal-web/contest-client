import { Users, Award, DollarSign, Zap } from 'lucide-react';
import CountUp from 'react-countup';

const stats = [
  {
    icon: <Users size={40} />,
    value: 1200,
    label: 'Happy Users',
    suffix: '+',
  },
  {
    icon: <Award size={40} />,
    value: 500,
    label: 'Contests Hosted',
    suffix: '+',
  },
  {
    icon: <DollarSign size={40} />,
    value: 25000,
    label: 'Prizes Won',
    prefix: '$',
    suffix: '+',
  },
  {
    icon: <Zap size={40} />,
    value: 150,
    label: 'Active Contests',
    suffix: '+',
  },
];

const StatisticsSection = () => {
  return (
    <section className="py-12 bg-base-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-2 text-base-content">Our Statistics</h2>
        <p className="text-center text-base-content/70 mb-8">
          Some key numbers about our platform.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-base-200 p-6 rounded-lg shadow-md text-center border border-base-300">
              <div className="flex justify-center items-center mb-4 text-primary">
                {stat.icon}
              </div>
              <h3 className="text-4xl font-bold">
                <CountUp start={0} end={stat.value} duration={3} separator="," prefix={stat.prefix} suffix={stat.suffix} />
              </h3>
              <p className="text-base-content/70">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;
