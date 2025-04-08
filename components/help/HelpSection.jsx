import { useEffect, useState } from 'react';
import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useUser } from "@/context/UserContext";

const HelpSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [faqs, setFaqs] = useState([]);
  const [message, setMessage] = useState('');
  const { user } = useUser();

  useEffect(() => {
    const fetchFaqs = async () => {
      const faqSnapshot = await getDocs(collection(db, 'faqs'));
      setFaqs(faqSnapshot.docs.map(doc => doc.data()));
    };
    fetchFaqs();
  }, []);

  const filteredFaqs = faqs.filter(faq => faq.question.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user.email) {
      alert("You must be logged in to submit a message.");
      return;
    }

    await addDoc(collection(db, 'help_messages'), {
      studentEmail: user.email, 
      message,
      timestamp: serverTimestamp(),
      status: 'unread'
    });

    alert("Your message has been sent to the advisor!");
    setMessage('');
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Help Section</h1>
      <input
        type="text"
        placeholder="Search FAQs"
        className="border p-2 mb-4 w-full"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="mb-6">
        {filteredFaqs.map((faq, idx) => (
          <div key={idx} className="mb-2">
            <strong>{faq.question}</strong>
            <p>{faq.answer}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <textarea
          className="border p-2 w-full mb-2"
          placeholder="Message to advisor"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        ></textarea>
        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-black py-2 px-4 rounded">
          Send Message
        </button>
      </form>
    </div>
  );
};

export default HelpSection;
