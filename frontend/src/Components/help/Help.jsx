import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function Help() {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (index) => {
    setOpenSection(openSection === index ? null : index);
  };

  const faqs = [
    {
      question: "How do I sign up and log in?",
      answer:
        "To access FitVerse, click on the Sign Up button, enter your details, and verify your email. If you already have an account, use the Login option.",
    },
    {
      question: "What is the dashboard for?",
      answer:
        "The dashboard provides an overview of your fitness progress, earned rewards, and daily activity stats.",
    },
    {
      question: "How can I earn rewards?",
      answer:
        "- Earn coins by walking, running, and sleeping.\n- Complete fitness challenges to earn additional rewards.\n- Track your progress in the dashboard.",
    },
    {
      question: "What are tasks, and how do I complete them?",
      answer:
        "FitVerse provides daily and weekly fitness tasks. Completing these tasks helps you earn extra rewards and improve your fitness journey.",
    },
    {
      question: "How does the leaderboard and community work?",
      answer:
        "- Compare your progress with other users on the leaderboard.\n- Join the community to stay motivated and participate in group challenges.",
    },
    {
      question: "How can I redeem my rewards?",
      answer:
        "Use your earned coins to unlock exclusive rewards and perks. Check the rewards section to see what’s available!",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Help & Support</h1>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <section
            key={index}
            className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-600"
          >
            <button
              className="text-lg font-medium w-full flex justify-between items-center focus:outline-none"
              onClick={() => toggleSection(index)}
            >
              <span>{faq.question}</span>
              {openSection === index ? (
                <ChevronUp className="text-gray-600" />
              ) : (
                <ChevronDown className="text-gray-600" />
              )}
            </button>
            {openSection === index && (
              <p className="mt-2 text-gray-700 border-t border-gray-300 pt-2">
                {faq.answer}
              </p>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
