import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { DarkModeBackground } from './DarkModeBackground';
import { MessageCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { theme } = useTheme();
  const whatsappNumber = '8801700000000';
  const whatsappMessage = encodeURIComponent('Hello! I would like to inquire about your vehicles.');

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
      theme === 'dark' ? 'bg-transparent text-white' : 'bg-transparent text-gray-900'
    }`}>
      {/* Premium Animated Background with rays - visible in both modes */}
      <DarkModeBackground />
      
      <Header />
      <main className="flex-grow relative z-10">{children}</main>
      <Footer />

      <a
        href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-110"
        aria-label="Contact on WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
    </div>
  );
};
