// Elegant dark theme with warm accents - inspired by premium event platforms
export const COLORS = {
  // Primary palette
  primary: '#E85D4C',        // Warm coral red
  primaryLight: '#FF7B6B',
  primaryDark: '#C94A3B',
  
  // Secondary palette
  secondary: '#F5A623',      // Golden amber
  secondaryLight: '#FFB84D',
  secondaryDark: '#D4881A',
  
  // Background colors
  background: '#0F1419',      // Deep charcoal
  backgroundLight: '#192028', // Lighter charcoal
  card: '#1E2732',           // Card background
  cardHover: '#252F3A',
  
  // Text colors
  text: '#FFFFFF',
  textSecondary: '#8B98A5',
  textMuted: '#536471',
  
  // Accent colors
  accent: '#1D9BF0',         // Twitter blue
  accentGreen: '#00BA7C',    // Success green
  accentPurple: '#7856FF',   // Purple accent
  
  // Status colors
  success: '#00BA7C',
  warning: '#F5A623',
  error: '#F4212E',
  info: '#1D9BF0',
  
  // Neutral
  white: '#FFFFFF',
  black: '#000000',
  gray100: '#F7F9FA',
  gray200: '#EFF3F4',
  gray300: '#CFD9DE',
  gray400: '#8B98A5',
  gray500: '#536471',
  gray600: '#374151',
  gray700: '#1F2937',
  
  // Overlays
  overlay: 'rgba(0, 0, 0, 0.6)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
  
  // Borders
  border: '#2F3336',
  borderLight: '#38444D',
};

export const FONTS = {
  // Using system fonts with fallbacks for better performance
  regular: 'System',
  medium: 'System',
  bold: 'System',
  light: 'System',
};

export const SIZES = {
  // Font sizes
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 22,
  xxxl: 28,
  title: 34,
  
  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  
  // Border radius
  radius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    full: 9999,
  },
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: {
    shadowColor: '#E85D4C',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
};

// Event categories with their colors
export const CATEGORIES = {
  Music: { color: '#E85D4C', icon: '🎵' },
  Technology: { color: '#1D9BF0', icon: '💻' },
  Food: { color: '#F5A623', icon: '🍔' },
  Art: { color: '#7856FF', icon: '🎨' },
  Health: { color: '#00BA7C', icon: '🧘' },
  Sports: { color: '#FF6B35', icon: '⚽' },
  Business: { color: '#4B5563', icon: '💼' },
  Entertainment: { color: '#EC4899', icon: '🎭' },
  Education: { color: '#06B6D4', icon: '📚' },
  Community: { color: '#8B5CF6', icon: '🤝' },
};

