const creators = [
  {
    name: 'Alice Johnson',
    role: 'Logo Design Specialist',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    contests: 25,
  },
  {
    name: 'Bob Williams',
    role: 'Business Idea Guru',
    avatar: 'https://randomuser.me/api/portraits/men/78.jpg',
    contests: 18,
  },
  {
    name: 'Charlie Brown',
    role: 'Writing Expert',
    avatar: 'https://randomuser.me/api/portraits/men/88.jpg',
    contests: 32,
  },
];

const FeaturedCreatorsSection = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-2">Featured Contest Creators</h2>
        <p className="text-center text-gray-600 mb-8">
          Meet some of our top contest creators.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {creators.map((creator, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
              <img src={creator.avatar} alt={creator.name} className="w-24 h-24 rounded-full mx-auto mb-4" />
              <h3 className="text-xl font-semibold">{creator.name}</h3>
              <p className="text-gray-600">{creator.role}</p>
              <div className="mt-4">
                <p className="text-lg font-bold">{creator.contests}</p>
                <p className="text-sm text-gray-500">Contests Created</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCreatorsSection;
