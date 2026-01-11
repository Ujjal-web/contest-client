import { PenTool, Briefcase, Mic, Camera, Code, Puzzle } from 'lucide-react';

const categories = [
  {
    icon: <PenTool size={32} />,
    name: 'Logo Design',
    description: 'Design creative logos for businesses and brands.',
  },
  {
    icon: <Briefcase size={32} />,
    name: 'Business Idea',
    description: 'Pitch your innovative business ideas and win funding.',
  },
  {
    icon: <Mic size={32} />,
    name: 'Article Writing',
    description: 'Showcase your writing skills by crafting compelling articles.',
  },
  {
    icon: <Camera size={32} />,
    name: 'Photography',
    description: 'Capture stunning moments and compete with other photographers.',
  },
  {
    icon: <Code size={32} />,
    name: 'Image Design',
    description: 'Create beautiful and engaging images for various purposes.',
  },
  {
    icon: <Puzzle size={32} />,
    name: 'Game Review',
    description: 'Play and review the latest games to win prizes.',
  },
];

const CategoriesSection = () => {
  return (
    <section className="py-12 bg-base-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-2 text-base-content">Contest Categories</h2>
        <p className="text-center text-base-content/70 mb-8">
          Explore contests from a variety of categories.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <div key={index} className="bg-base-200 p-6 rounded-lg shadow-md text-center">
              <div className="flex justify-center items-center mb-4 text-primary">
                {category.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-base-content">{category.name}</h3>
              <p className="text-base-content/70">{category.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
