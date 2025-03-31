import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Help() {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (index) => {
    setOpenSection(openSection === index ? null : index);
  };

  const faqs = [
    {
      question: "How do I sign up and log in?",
      answer:
        "To access FitVerse, use the 'Sign in with Google' button on the Login page. Ensure you grant the necessary permissions when prompted.",
    },
    {
      question: "What is the dashboard for?",
      answer:
        "The dashboard provides an overview of your recent fitness activity (steps, active minutes, calories), daily goal progress, activity streak, and weekly trends, pulled from your connected Google Fit account.",
    },
    {
      question: "How can I earn rewards (Coins)?",
      answer:
        "You earn Coins primarily by completing challenges listed on the Challenges page. These challenges are based on achieving specific fitness targets (e.g., steps per week).",
    },
    {
      question: "How do Challenges work?",
      answer:
        "Navigate to the Challenges page to see available tasks. Progress is tracked automatically based on your Google Fit data. Once a challenge target is met, click the 'Collect Coins' button to add the reward to your balance.",
    },
    {
      question: "How do I connect Google Fit?",
      answer:
        "If not connected, you'll see prompts on the Dashboard or Activity pages. Click 'Connect Google Fit' and follow the Google authentication process. Ensure you grant access to the requested fitness data (steps, activity, calories). If you encounter issues, try disconnecting FitVerse from your Google Account permissions and reconnecting.",
    },
    {
      question: "How can I redeem my rewards?",
      answer:
        "Go to the Rewards Store page. If you have enough Coins for a reward, click the 'Redeem' button. The coin cost will be deducted from your balance.",
    },
    {
      question: "How do I update my profile?",
      answer:
        "Go to the Profile page. Click 'Edit Profile', make your changes (currently only name editing is supported frontend-only), and click 'Save Changes'.",
    },
  ];

  return (
    <div className="space-y-3">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm"
        >
          <button
            className="w-full flex justify-between items-center p-4 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75 transition-colors"
            onClick={() => toggleSection(index)}
            aria-expanded={openSection === index}
            aria-controls={`faq-content-${index}`}
          >
            <span>{faq.question}</span>
            {openSection === index ? (
              <ChevronUp className="text-gray-500 h-5 w-5 flex-shrink-0" />
            ) : (
              <ChevronDown className="text-gray-500 h-5 w-5 flex-shrink-0" />
            )}
          </button>
          <AnimatePresence initial={false}>
            {openSection === index && (
              <motion.div
                id={`faq-content-${index}`}
                key="content"
                initial="collapsed"
                animate="open"
                exit="collapsed"
                variants={{
                  open: { opacity: 1, height: "auto" },
                  collapsed: { opacity: 0, height: 0 },
                }}
                transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                className="overflow-hidden"
              >
                <p className="px-4 pb-4 pt-2 text-sm text-gray-600 whitespace-pre-line border-t border-gray-100">
                  {faq.answer}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
