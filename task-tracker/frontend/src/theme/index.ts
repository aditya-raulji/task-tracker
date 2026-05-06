export const theme = {
  colors: {
    // Backgrounds
    bg: {
      screen: '#EEF0F5',        // Main screen bg (light blueish-grey)
      glass: 'rgba(255,255,255,0.45)',   // Glass card bg
      glassStrong: 'rgba(255,255,255,0.65)', // Stronger glass (modals)
      card: 'rgba(255,255,255,0.7)',  // Task cards
      input: 'rgba(255,255,255,0.6)', // Input fields
      white: '#FFFFFF',
    },
    // Text
    text: {
      primary: '#111827',    // Main text (almost black)
      secondary: '#6B7280',  // Labels, secondary
      muted: '#9CA3AF',      // Hints, dates, placeholders
      white: '#FFFFFF',
      error: '#EF4444',
      success: '#22C55E',
    },
    // Borders
    border: {
      light: 'rgba(255,255,255,0.85)',  // Glass borders
      default: 'rgba(0,0,0,0.07)',      // Card borders
      focus: '#6366F1',                  // Accent on focus
      error: '#EF4444',
    },
    // Semantic
    primary: '#111827',    // Black — buttons, strong elements
    accent: '#6366F1',     // Indigo — highlights, focus, links
    success: '#22C55E',    // Green — completed tasks
    error: '#EF4444',      // Red — delete, errors
    warning: '#F59E0B',    // Amber — warnings
  },

  // Typography
  fonts: {
    heading: 'PlayfairDisplay_600SemiBold_Italic',  // Cursive/italic headings
    body: 'Inter_400Regular',
    bodyMedium: 'Inter_500Medium',
  },
  fontSize: {
    xs: 11,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 22,
    xxl: 28,
  },

  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 28,
    xxxl: 40,
  },

  // Radius
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 999,
  },

  // Shadows
  shadow: {
    card: {
      shadowColor: '#6366F1',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 16,
      elevation: 4,
    },
    fab: {
      shadowColor: '#111827',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 12,
      elevation: 8,
    },
    subtle: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 8,
      elevation: 2,
    },
  },
};
