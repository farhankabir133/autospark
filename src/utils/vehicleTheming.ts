/**
 * Vehicle Theming System
 * Provides dynamic gradient backgrounds and color schemes based on vehicle type
 */

export type VehicleCategory = 'Luxury' | 'Performance' | 'Eco' | 'Family' | 'Premium';

interface ThemeConfig {
  gradientLight: string;
  gradientDark: string;
  accentColor: string;
  secondaryAccent: string;
  borderColor: string;
  shadowColor: string;
  cardBgLight: string;
  cardBgDark: string;
}

/**
 * Determine vehicle category based on model name, price, or body type
 */
export const getVehicleCategory = (
  model: string,
  price: number,
  bodyType?: string,
  fuelType?: string
): VehicleCategory => {
  const lowerModel = model.toLowerCase();
  const lowerBody = (bodyType || '').toLowerCase();
  const lowerFuel = (fuelType || '').toLowerCase();

  // Luxury vehicles
  if (
    lowerModel.includes('harrier') ||
    lowerModel.includes('landcruiser') ||
    lowerModel.includes('lexus') ||
    lowerBody.includes('premium') ||
    price > 7000000
  ) {
    return 'Luxury';
  }

  // Performance/Sport vehicles
  if (
    lowerModel.includes('mustang') ||
    lowerModel.includes('challenger') ||
    lowerModel.includes('camaro') ||
    lowerModel.includes('gt-r') ||
    price > 6000000
  ) {
    return 'Performance';
  }

  // Eco vehicles
  if (
    lowerFuel.includes('hybrid') ||
    lowerFuel.includes('electric') ||
    lowerFuel.includes('ev') ||
    lowerModel.includes('prius') ||
    lowerModel.includes('leaf') ||
    lowerModel.includes('insight')
  ) {
    return 'Eco';
  }

  // Family vehicles
  if (
    lowerBody.includes('mpv') ||
    lowerBody.includes('sedan') ||
    lowerBody.includes('crossover')
  ) {
    return 'Family';
  }

  return 'Premium';
};

/**
 * Get theme configuration for vehicle type
 */
export const getVehicleTheme = (category: VehicleCategory, isDark: boolean): ThemeConfig => {
  const themes: Record<VehicleCategory, { light: ThemeConfig; dark: ThemeConfig }> = {
    // Luxury: Gold & Sapphire Blue tones
    Luxury: {
      light: {
        gradientLight:
          'linear-gradient(135deg, rgba(250, 235, 215, 0.4) 0%, rgba(230, 204, 142, 0.3) 50%, rgba(218, 180, 105, 0.2) 100%)',
        gradientDark:
          'linear-gradient(135deg, rgba(41, 38, 34, 0.8) 0%, rgba(55, 48, 38, 0.8) 50%, rgba(41, 38, 34, 0.8) 100%)',
        accentColor: '#D4AF37', // Gold
        secondaryAccent: '#1E3A5F', // Sapphire
        borderColor: 'rgba(212, 175, 55, 0.3)',
        shadowColor: 'rgba(212, 175, 55, 0.2)',
        cardBgLight: 'rgba(255, 255, 255, 0.9)',
        cardBgDark: 'rgba(30, 30, 35, 0.95)',
      },
      dark: {
        gradientLight:
          'linear-gradient(135deg, rgba(20, 20, 25, 0.9) 0%, rgba(35, 32, 28, 0.9) 50%, rgba(25, 22, 18, 0.9) 100%)',
        gradientDark:
          'linear-gradient(135deg, rgba(10, 10, 15, 0.95) 0%, rgba(25, 22, 18, 0.95) 50%, rgba(15, 12, 10, 0.95) 100%)',
        accentColor: '#FFD700', // Bright Gold
        secondaryAccent: '#4A7BA7', // Light Sapphire
        borderColor: 'rgba(255, 215, 0, 0.2)',
        shadowColor: 'rgba(212, 175, 55, 0.15)',
        cardBgLight: 'rgba(40, 40, 50, 0.95)',
        cardBgDark: 'rgba(20, 20, 25, 0.98)',
      },
    },

    // Performance: Red & Graphite tones
    Performance: {
      light: {
        gradientLight:
          'linear-gradient(135deg, rgba(255, 240, 245, 0.4) 0%, rgba(255, 200, 190, 0.3) 50%, rgba(230, 100, 100, 0.15) 100%)',
        gradientDark:
          'linear-gradient(135deg, rgba(50, 35, 35, 0.8) 0%, rgba(60, 40, 40, 0.8) 50%, rgba(45, 30, 30, 0.8) 100%)',
        accentColor: '#E63946', // Performance Red
        secondaryAccent: '#2A2A2A', // Graphite
        borderColor: 'rgba(230, 57, 70, 0.3)',
        shadowColor: 'rgba(230, 57, 70, 0.15)',
        cardBgLight: 'rgba(255, 255, 255, 0.92)',
        cardBgDark: 'rgba(35, 35, 40, 0.95)',
      },
      dark: {
        gradientLight:
          'linear-gradient(135deg, rgba(30, 20, 20, 0.9) 0%, rgba(50, 30, 30, 0.9) 50%, rgba(35, 20, 20, 0.9) 100%)',
        gradientDark:
          'linear-gradient(135deg, rgba(15, 10, 10, 0.95) 0%, rgba(35, 20, 20, 0.95) 50%, rgba(20, 12, 12, 0.95) 100%)',
        accentColor: '#FF5252', // Bright Red
        secondaryAccent: '#666666', // Light Graphite
        borderColor: 'rgba(230, 57, 70, 0.25)',
        shadowColor: 'rgba(230, 57, 70, 0.12)',
        cardBgLight: 'rgba(45, 45, 50, 0.95)',
        cardBgDark: 'rgba(25, 25, 30, 0.98)',
      },
    },

    // Eco: Green & Teal tones
    Eco: {
      light: {
        gradientLight:
          'linear-gradient(135deg, rgba(240, 255, 240, 0.4) 0%, rgba(200, 240, 220, 0.3) 50%, rgba(150, 220, 200, 0.2) 100%)',
        gradientDark:
          'linear-gradient(135deg, rgba(35, 50, 40, 0.8) 0%, rgba(40, 55, 45, 0.8) 50%, rgba(35, 48, 40, 0.8) 100%)',
        accentColor: '#10B981', // Eco Green
        secondaryAccent: '#06B6D4', // Teal
        borderColor: 'rgba(16, 185, 129, 0.3)',
        shadowColor: 'rgba(16, 185, 129, 0.15)',
        cardBgLight: 'rgba(255, 255, 255, 0.90)',
        cardBgDark: 'rgba(30, 40, 35, 0.95)',
      },
      dark: {
        gradientLight:
          'linear-gradient(135deg, rgba(20, 35, 28, 0.9) 0%, rgba(28, 45, 38, 0.9) 50%, rgba(22, 38, 32, 0.9) 100%)',
        gradientDark:
          'linear-gradient(135deg, rgba(10, 20, 15, 0.95) 0%, rgba(18, 35, 28, 0.95) 50%, rgba(12, 25, 20, 0.95) 100%)',
        accentColor: '#34D399', // Bright Green
        secondaryAccent: '#22D3EE', // Bright Teal
        borderColor: 'rgba(16, 185, 129, 0.25)',
        shadowColor: 'rgba(16, 185, 129, 0.12)',
        cardBgLight: 'rgba(35, 45, 42, 0.95)',
        cardBgDark: 'rgba(20, 30, 27, 0.98)',
      },
    },

    // Family: Blue & Gray tones
    Family: {
      light: {
        gradientLight:
          'linear-gradient(135deg, rgba(240, 250, 255, 0.4) 0%, rgba(200, 230, 255, 0.3) 50%, rgba(150, 200, 240, 0.2) 100%)',
        gradientDark:
          'linear-gradient(135deg, rgba(35, 45, 55, 0.8) 0%, rgba(40, 50, 60, 0.8) 50%, rgba(35, 45, 55, 0.8) 100%)',
        accentColor: '#0EA5E9', // Sky Blue
        secondaryAccent: '#64748B', // Slate
        borderColor: 'rgba(14, 165, 233, 0.3)',
        shadowColor: 'rgba(14, 165, 233, 0.15)',
        cardBgLight: 'rgba(255, 255, 255, 0.91)',
        cardBgDark: 'rgba(30, 40, 50, 0.95)',
      },
      dark: {
        gradientLight:
          'linear-gradient(135deg, rgba(20, 30, 40, 0.9) 0%, rgba(28, 40, 52, 0.9) 50%, rgba(22, 35, 48, 0.9) 100%)',
        gradientDark:
          'linear-gradient(135deg, rgba(10, 15, 25, 0.95) 0%, rgba(18, 30, 45, 0.95) 50%, rgba(12, 22, 35, 0.95) 100%)',
        accentColor: '#38BDF8', // Bright Sky
        secondaryAccent: '#94A3B8', // Light Slate
        borderColor: 'rgba(14, 165, 233, 0.25)',
        shadowColor: 'rgba(14, 165, 233, 0.12)',
        cardBgLight: 'rgba(35, 45, 60, 0.95)',
        cardBgDark: 'rgba(20, 30, 45, 0.98)',
      },
    },

    // Premium: Purple & Silver tones
    Premium: {
      light: {
        gradientLight:
          'linear-gradient(135deg, rgba(250, 245, 255, 0.4) 0%, rgba(230, 210, 255, 0.3) 50%, rgba(200, 150, 240, 0.2) 100%)',
        gradientDark:
          'linear-gradient(135deg, rgba(45, 35, 55, 0.8) 0%, rgba(55, 40, 65, 0.8) 50%, rgba(45, 35, 55, 0.8) 100%)',
        accentColor: '#A855F7', // Vibrant Purple
        secondaryAccent: '#C0C0C0', // Silver
        borderColor: 'rgba(168, 85, 247, 0.3)',
        shadowColor: 'rgba(168, 85, 247, 0.15)',
        cardBgLight: 'rgba(255, 255, 255, 0.89)',
        cardBgDark: 'rgba(35, 30, 45, 0.95)',
      },
      dark: {
        gradientLight:
          'linear-gradient(135deg, rgba(25, 20, 35, 0.9) 0%, rgba(40, 30, 55, 0.9) 50%, rgba(30, 20, 40, 0.9) 100%)',
        gradientDark:
          'linear-gradient(135deg, rgba(12, 8, 20, 0.95) 0%, rgba(30, 20, 45, 0.95) 50%, rgba(18, 10, 30, 0.95) 100%)',
        accentColor: '#D8B4FE', // Light Purple
        secondaryAccent: '#E2E8F0', // Light Gray
        borderColor: 'rgba(168, 85, 247, 0.25)',
        shadowColor: 'rgba(168, 85, 247, 0.12)',
        cardBgLight: 'rgba(45, 35, 55, 0.95)',
        cardBgDark: 'rgba(25, 18, 35, 0.98)',
      },
    },
  };

  return isDark ? themes[category].dark : themes[category].light;
};

/**
 * Generate CSS custom properties for a vehicle theme
 */
export const generateThemeVariables = (category: VehicleCategory, isDark: boolean): Record<string, string> => {
  const theme = getVehicleTheme(category, isDark);

  return {
    '--vehicle-gradient-light': theme.gradientLight,
    '--vehicle-gradient-dark': theme.gradientDark,
    '--vehicle-accent': theme.accentColor,
    '--vehicle-accent-secondary': theme.secondaryAccent,
    '--vehicle-border': theme.borderColor,
    '--vehicle-shadow': theme.shadowColor,
    '--vehicle-card-light': theme.cardBgLight,
    '--vehicle-card-dark': theme.cardBgDark,
  };
};

/**
 * Get card styling based on theme
 */
export const getCardStyling = (category: VehicleCategory, isDark: boolean) => {
  const theme = getVehicleTheme(category, isDark);

  return {
    backgroundColor: isDark ? theme.cardBgDark : theme.cardBgLight,
    borderColor: theme.borderColor,
    boxShadow: `0 10px 30px ${theme.shadowColor}`,
  };
};

/**
 * Get gradient background for viewer
 */
export const getViewerGradient = (category: VehicleCategory, isDark: boolean): string => {
  const theme = getVehicleTheme(category, isDark);
  return isDark ? theme.gradientDark : theme.gradientLight;
};

/**
 * Accent color by category (for buttons, highlights)
 */
export const getAccentColor = (category: VehicleCategory, isDark: boolean): string => {
  return getVehicleTheme(category, isDark).accentColor;
};
