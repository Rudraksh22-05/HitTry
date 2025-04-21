
import { Shield, Users, Zap, Lock } from 'lucide-react';
import AnimatedIcon from '@/components/ui/AnimatedIcon';
import { useState, useEffect } from 'react';

const Features = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById('features-section');
      if (element) {
        const position = element.getBoundingClientRect();
        
        // If the top of the element is in the viewport
        if (position.top < window.innerHeight * 0.8) {
          setIsVisible(true);
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on initial load
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const features = [
    {
      icon: <Shield size={32} />,
      title: 'Privacy-Focused',
      description: 'No personal data storage, with blockchain-backed security to protect your identity.',
      delay: 0,
    },
    {
      icon: <Users size={32} />,
      title: 'Connect Anonymously',
      description: 'Peer-to-peer support without revealing your identity. Secure and confidential.',
      delay: 200,
    },
    {
      icon: <Zap size={32} />,
      title: 'Get Help Anytime',
      description: 'Emergency assistance, mentorship, and connections to NGOs whenever you need it.',
      delay: 400,
    },
    {
      icon: <Lock size={32} />,
      title: 'Total Control',
      description: 'You control your data. Auto-delete messages, remain anonymous, and stay secure.',
      delay: 600,
    },
  ];

  return (
    <section id="features-section" className="bg-secondary/30 py-20">
      <div className="section-container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-medium mb-4">Secure Support, Designed for You</h2>
          <p className="text-muted-foreground">
            Our platform is built from the ground up with security, privacy, and your well-being as our priorities.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`feature-card ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}
              style={{ animationDelay: `${feature.delay}ms` }}
            >
              <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                <div className="text-primary">{feature.icon}</div>
              </div>
              <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
