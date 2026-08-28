/**
 * MRPL Institutional Design Tokens
 * 
 * Theme: MRPL / ONGC Institutional Identity + Premium Indian Public-Sector Usability
 * Anchor Brand: MRPL Green (#5C822D), Deep Forest (#35551F)
 * Canvas: Warm Ivory (#F7F6F1), White Surface (#FFFFFF), Soft Surface (#F0EFE9)
 * Typography: Noto Sans (Primary text: #263026, Secondary: #596158, Muted: #7A8178)
 * Accents: Terracotta / Saffron (#C96B32), Subtle Gold (#B89B5E)
 * Tricolor Ribbon: #FF9933, #FFFFFF, #138808 (4px horizontal strip)
 */

export const DESIGN_TOKENS = {
  colors: {
    // Brand Anchor
    brandGreen: '#5C822D',     // Primary action green (MRPL identity)
    brandDarkGreen: '#35551F', // Deep forest supporting dark green
    brandLightGreen: '#EEF3E7',// Pale green background tint

    // Canvas & Working Surfaces
    canvas: '#F7F6F1',         // Warm ivory main background
    canvasAlt: '#F4F3EE',      // Soft canvas alternative
    surface: '#FFFFFF',        // Pure white card working surface
    surfaceSoft: '#F0EFE9',    // Light warm card secondary surface

    // Borders
    border: '#E7E5DE',         // Warm neutral border
    borderStrong: '#D5D2C9',   // Stronger boundary border

    // Typography
    textPrimary: '#263026',    // Dark charcoal/deep green-grey text
    textSecondary: '#596158',  // Secondary descriptive text
    textMuted: '#7A8178',      // Muted metadata & timestamps

    // Accents
    terracotta: '#C96B32',     // Accent / warning / attention (used sparingly ~2%)
    saffronAlt: '#D47A32',     // Saffron terracotta alternative
    gold: '#B89B5E',           // Muted gold for institutional detail

    // Semantic Status Colors
    success: '#5C822D',
    successBg: '#EEF3E7',
    warning: '#C96B32',
    warningBg: '#FAEFE7',
    error: '#A94442',
    errorBg: '#F7EAEA',
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
