const posts = [
  {
    image: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    title: '10 Tips for Winning Your Next Design Contest',
    excerpt: 'Learn how to improve your chances of winning your next design contest with these expert tips.',
    date: 'Jan 10, 2023',
  },
  {
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    title: 'The Rise of Online Contests and a New Way of Working',
    excerpt: 'Discover how online contests are changing the way creatives work and collaborate.',
    date: 'Jan 15, 2023',
  },
  {
    image: 'https://images.unsplash.com/photo-1587614382346-4ec58e3739a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    title: 'How to Write a Compelling Contest Brief',
    excerpt: 'A well-written contest brief is key to attracting top talent. Here is how to write one.',
    date: 'Jan 20, 2023',
  },
];

const BlogSection = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-2">From Our Blog</h2>
        <p className="text-center text-gray-600 mb-8">
          Check out our latest articles.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src={post.image} alt={post.title} className="h-48 w-full object-cover" />
              <div className="p-6">
                <p className="text-sm text-gray-500 mb-2">{post.date}</p>
                <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                <p className="text-gray-600">{post.excerpt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
