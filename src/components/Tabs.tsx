import { motion } from 'framer-motion';
import React, { useState } from 'react';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  defaultTabId?: string;
  theme: string;
  variant?: 'plain' | 'underline' | 'pills';
  vertical?: boolean;
  onTabChange?: (tabId: string) => void;
}

export const Tabs = ({
  tabs,
  defaultTabId,
  theme,
  variant = 'underline',
  vertical = false,
  onTabChange,
}: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultTabId || tabs[0]?.id);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const secondaryText = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const activeBg = theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-300';
  const hoverBg = theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100';

  const getTabButtonClass = (isActive: boolean) => {
    switch (variant) {
      case 'pills':
        return isActive
          ? `${activeBg} ${textColor}`
          : `${secondaryText} ${hoverBg}`;
      case 'underline':
        return isActive
          ? `${textColor} border-b-2 border-blue-500`
          : `${secondaryText}`;
      default:
        return isActive ? textColor : secondaryText;
    }
  };

  const containerClass = vertical
    ? 'flex gap-4'
    : 'flex flex-col';
  const tabListClass = vertical
    ? 'flex flex-col gap-2 w-32'
    : 'flex gap-2 border-b ' + borderColor;

  const activeTabContent = tabs.find((tab) => tab.id === activeTab);

  return (
    <div className={containerClass}>
      {/* Tab List */}
      <div className={tabListClass}>
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded transition-colors relative ${getTabButtonClass(activeTab === tab.id)}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {tab.icon && <span className="text-lg">{tab.icon}</span>}
            <span className="font-medium">{tab.label}</span>

            {activeTab === tab.id && variant === 'pills' && (
              <motion.div
                layoutId="activeTabPill"
                className="absolute inset-0 rounded bg-blue-500/10 -z-10"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}

            {activeTab === tab.id && variant === 'underline' && (
              <motion.div
                layoutId="activeTabUnderline"
                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className={vertical ? 'flex-1' : 'w-full'}
      >
        {activeTabContent?.content}
      </motion.div>
    </div>
  );
};

interface AccordionItemProps {
  id: string;
  title: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItemProps[];
  theme: string;
  allowMultiple?: boolean;
  defaultOpenId?: string;
}

export const Accordion = ({
  items,
  theme,
  allowMultiple = false,
  defaultOpenId,
}: AccordionProps) => {
  const [openItems, setOpenItems] = useState<string[]>(
    defaultOpenId ? [defaultOpenId] : []
  );

  const toggleItem = (id: string) => {
    if (allowMultiple) {
      setOpenItems((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    } else {
      setOpenItems((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  const bgColor = theme === 'dark' ? 'bg-gray-900' : 'bg-white';
  const borderColor = theme === 'dark' ? 'border-gray-800' : 'border-gray-200';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const secondaryText = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const hoverBg = theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-50';

  return (
    <div className={`border ${borderColor} rounded-lg overflow-hidden`}>
      {items.map((item, idx) => (
        <div key={item.id} className={idx > 0 ? `border-t ${borderColor}` : ''}>
          <button
            onClick={() => toggleItem(item.id)}
            className={`w-full flex items-center justify-between p-4 ${hoverBg} transition-colors`}
          >
            <div className="flex items-center gap-3">
              {item.icon && <span className="text-lg">{item.icon}</span>}
              <h3 className={`font-semibold ${textColor}`}>{item.title}</h3>
            </div>

            <motion.svg
              className={`w-5 h-5 ${secondaryText}`}
              fill="none"
              strokeWidth={2}
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={openItems.includes(item.id) ? { rotate: 180 } : {}}
              transition={{ duration: 0.2 }}
            >
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </motion.svg>
          </button>

          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={
              openItems.includes(item.id)
                ? { height: 'auto', opacity: 1 }
                : { height: 0, opacity: 0 }
            }
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div
              className={`p-4 border-t ${borderColor} bg-opacity-50 ${bgColor}`}
            >
              {item.content}
            </div>
          </motion.div>
        </div>
      ))}
    </div>
  );
};
