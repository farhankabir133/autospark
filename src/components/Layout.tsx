import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { MessageCircle, Phone } from 'lucide-react';
import CompositeFAB from './ui/CompositeFAB';
import { useTheme } from '../contexts/ThemeContext';
// Chat widget removed. ChatProvider and ChatWidget were deleted.

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { theme } = useTheme();
  const whatsappNumber = '8801760401605';
  const whatsappMessage = encodeURIComponent('Hello! I would like to inquire about your vehicles.');

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
      theme === 'dark' ? 'bg-[#0a0a0a] text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Skip link for keyboard users */}
      <a href="#main-content" className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:text-black focus:px-3 focus:py-2 focus:rounded-md">Skip to content</a>
      <Header />
      <main id="main-content" className="flex-grow relative z-10">{children}</main>
      <Footer />

      {/* Composite floating actions (left side). actions[0] will be lowest (WhatsApp). */}
      <CompositeFAB
        actions={[
          {
            href: `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`,
            ariaLabel: 'Contact on WhatsApp',
            icon: <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />,
            bgClass: 'bg-green-500 hover:bg-green-600',
          },
          {
            href: `tel:+8801760401605`,
            ariaLabel: 'Call showroom',
            icon: <Phone className="h-5 w-5 sm:h-6 sm:w-6" />,
            bgClass: 'bg-[#C00000] hover:bg-[#b00000]',
          },
        ]}
        position="left"
        posClass="left-4 sm:left-6"
        stackIndex={0}
        baseOffsetPx={16}
        gapPx={12}
        sizePx={56}
      />
      {/* Chat assistant removed */}
    </div>
  );
};
