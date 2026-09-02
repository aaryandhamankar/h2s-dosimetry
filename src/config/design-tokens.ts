/**
 * Institutional Safety Design Tokens
 * 
 * Theme: Industrial Occupational Safety Identity + Premium Usability
 * Anchor Brand: Forest Green (#5C822D), Deep Forest (#35551F)
 * Canvas: Warm Cream (#FAF6EE), White Surface (#FFFFFF), Soft Surface (#F4EFE6)
 * Typography: Noto Sans (Primary text: #263026, Secondary: #596158, Muted: #7A8178)
 * Accents: Saffron Orange (#FF9933), Golden Amber (#FFDE59), Terracotta (#C96B32)
 * Tricolor Ribbon: #FF9933 (Saffron), #FFFFFF (White), #138808 (India Green)
 */

export const DESIGN_TOKENS = {
  colors: {
    // Brand Anchor
    brandGreen: '#5C822D',     // Primary action green (safety identity)
    brandDarkGreen: '#35551F', // Deep forest supporting dark green
    brandLightGreen: '#EDF3E4',// Pale green background tint
    brandGreenBorder: '#C6DCC0',// Clean green border tone

    // Canvas & Working Surfaces
    canvas: '#FAF6EE',         // Warm cream main background
    canvasAlt: '#F5F0E4',      // Soft cream canvas alternative
    surface: '#FFFFFF',        // Pure white card working surface
    surfaceSoft: '#F4EFE6',    // Light warm cream card secondary surface
    surfaceMuted: '#FAF7F0',   // Subtle card container tone

    // Borders
    border: '#E8E2D5',         // Warm neutral border
    borderStrong: '#D8D0C0',   // Stronger boundary border

    // Typography
    textPrimary: '#263026',    // Dark charcoal/deep green-grey text
    textSecondary: '#596158',  // Secondary descriptive text
    textMuted: '#7A8178',      // Muted metadata & timestamps

    // Saffron & Golden Amber Warm Palette (Tricolor & Interactive Glow)
    saffron: '#FF9933',        // National Saffron Orange
    saffronAlt: '#FF9933',     // Saffron alias
    goldenAmber: '#FFDE59',    // High-visibility golden yellow glow
    terracotta: '#C96B32',     // Warm terracotta accent / warning
    warmAmber: '#D97706',      // Deep amber for text legibility on light surfaces

    // Semantic Status Colors
    success: '#5C822D',
    successBg: '#EDF3E4',
    warning: '#C96B32',
    warningBg: '#FAF2EB',
    error: '#A94442',
    errorBg: '#F8ECEC',
    info: '#397C7A',
    infoBg: '#EAF3F2',

    // Indian Tricolor Accent
    tricolorSaffron: '#FF9933',
    tricolorWhite: '#FFFFFF',
    tricolorGreen: '#138808',
  },

  typography: {
    fontFamily: '"Noto Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    scale: {
      pageTitle: 'text-[28px] sm:text-[32px] font-bold leading-tight',
      sectionHeading: 'text-[20px] sm:text-[24px] font-bold leading-snug',
      componentHeading: 'text-[16px] sm:text-[18px] font-semibold leading-normal',
      body: 'text-[15px] sm:text-[16px] font-normal leading-relaxed',
      label: 'text-[13px] sm:text-[14px] font-semibold',
      metadata: 'text-[12px] sm:text-[13px] font-normal',
      button: 'text-[14px] sm:text-[15px] font-semibold',
    },
  },

  layout: {
    maxWidth: 'max-w-[1200px]',
    pagePadding: 'px-4 sm:px-8',
    sectionSpacing: 'space-y-6',
  },

  radii: {
    sm: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px',
  },

  controls: {
    buttonHeight: 'h-[42px]',
    inputHeight: 'h-[42px]',
    headerHeight: 'h-[74px]',
  },
} as const;
