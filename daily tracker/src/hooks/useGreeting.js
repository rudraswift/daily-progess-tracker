import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const useGreeting = () => {
  const { user } = useContext(AuthContext);
  // Default to 'there' if user doesn't exist yet, or split fullname to get first name
  const userName = user?.name ? user.name.split(' ')[0] : "there";
  
  const [fullGreeting, setFullGreeting] = useState('');
  const [typedGreeting, setTypedGreeting] = useState('');
  const [motivation, setMotivation] = useState('');

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      let greetingText = '';
      let motivationText = '';
      
      // Calculate active time slots
      if (hour >= 5 && hour < 12) {
        // 5 AM to 11:59 AM
        greetingText = `Good Morning ☀️, ${userName} 👋`;
        motivationText = "Win the morning, win the day 🚀";
      } else if (hour >= 12 && hour < 17) {
        // 12 PM to 4:59 PM
        greetingText = `Good Afternoon 🌤️, ${userName} 👋`;
        motivationText = "Keep the momentum going 🌟";
      } else if (hour >= 17 && hour < 20) {
        // 5 PM to 7:59 PM
        greetingText = `Good Evening 🌆, ${userName} 👋`;
        motivationText = "Finish strong 💯";
      } else {
        // 8 PM to 4:59 AM
        greetingText = `Good Night 🌙, ${userName} 👋`;
        motivationText = "Review your progress today 📊";
      }

      if (greetingText !== fullGreeting) {
        setFullGreeting(greetingText);
        setMotivation(motivationText);
        setTypedGreeting(''); // Trigger re-type
      }
    };

    updateGreeting();

    // Check time every minute backwards and update if phase shifts
    const intervalId = setInterval(updateGreeting, 60000); 
    return () => clearInterval(intervalId);
  }, [userName, fullGreeting]);

  // Typing animation effect
  useEffect(() => {
    if (!fullGreeting) return;

    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < fullGreeting.length) {
        // We use substring to ensure emojis counting as multiple characters don't break as wildly
        setTypedGreeting(fullGreeting.substring(0, index + 1));
        index++;
      } else {
        clearInterval(typingInterval);
      }
    }, 45); // Typing speed

    return () => clearInterval(typingInterval);
  }, [fullGreeting]);

  return { greeting: typedGreeting, motivation };
};

export default useGreeting;
