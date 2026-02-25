export const formatPrice = (price: number, language: 'en' | 'bn' = 'en'): string => {
  const formatted = price.toLocaleString('en-BD');
  return language === 'bn' ? `৳${formatted}` : `BDT ${formatted}`;
};

export const formatNumber = (num: number, language: 'en' | 'bn' = 'en'): string => {
  if (language === 'bn') {
    const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num
      .toString()
      .split('')
      .map(digit => (digit >= '0' && digit <= '9' ? bengaliDigits[parseInt(digit)] : digit))
      .join('');
  }
  return num.toLocaleString('en-US');
};

export const formatDate = (date: string, language: 'en' | 'bn' = 'en'): string => {
  const d = new Date(date);
  if (language === 'bn') {
    return d.toLocaleDateString('bn-BD');
  }
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

export const generateSessionId = (): string => {
  let sessionId = localStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('session_id', sessionId);
  }
  return sessionId;
};

export const generateOrderNumber = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `ASB${timestamp}${random}`;
};

export const calculateEMI = (
  principal: number,
  annualRate: number,
  years: number
): number => {
  const monthlyRate = annualRate / 12 / 100;
  const months = years * 12;
  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);
  return Math.round(emi);
};
