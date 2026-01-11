import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'How do I participate in a contest?',
    answer: 'To participate in a contest, you need to create an account, find a contest you like, and submit your entry before the deadline. Some contests may require a small entry fee.',
  },
  {
    question: 'How are the winners selected?',
    answer: 'The contest creator is responsible for selecting the winner based on the contest rules and criteria. The winner is usually announced within a few days after the deadline.',
  },
  {
    question: 'How do I receive my prize money?',
    answer: 'The prize money is transferred to your account on our platform. You can then withdraw the money to your bank account or PayPal.',
  },
  {
    question: 'Can I create my own contest?',
    answer: 'Yes, you can create your own contest by becoming a contest creator. You will need to provide the contest details, rules, and prize money.',
  },
];

const FaqItem = ({ faq, index }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="w-full flex justify-between items-center text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-medium">{faq.question}</span>
        <ChevronDown
          className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="mt-4 text-gray-600">
          <p>{faq.answer}</p>
        </div>
      )}
    </div>
  );
};

const FaqSection = () => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-2">Frequently Asked Questions</h2>
        <p className="text-center text-gray-600 mb-8">
          Here are some of our most frequently asked questions.
        </p>
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <FaqItem key={index} faq={faq} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
