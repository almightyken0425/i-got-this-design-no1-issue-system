// F4 灰藍主題。sand / PRIMARY_PINE 保留相容識別名，值由本次 Foundations 定案。
const PALETTE = {
  sand: {
    0: '#FFFFFF', 50: '#F8F9FB', 100: '#F0F2F6', 200: '#E5E8ED', 300: '#CDD3DD',
    400: '#A5AFBF', 500: '#7F8999', 600: '#677384', 700: '#4D596C', 800: '#384355',
    900: '#2C3441', 950: '#171D29', 1000: '#0E1320',
  },
  semantic: {
    success: '#16A34A', warning: '#D97706', error: '#DC2626', info: '#0284C7',
  },
};

const PRIMARY_PINE = {
  50: '#EDF0FC', 100: '#E1E7FB', 200: '#CBD5F8', 300: '#B5C3F7', 400: '#A2B3FF',
  500: '#7A91EA', 600: '#6680E0', 700: '#526CCE', 800: '#4663D2', 900: '#354FAF',
};

const SHADOW_ELEVATION = {
  level0: { offsetY: 0, blur: 0,  opacity: 0    },
  level1: { offsetY: 1, blur: 2,  opacity: 0.06 },
  level2: { offsetY: 4, blur: 12, opacity: 0.10 },
  level3: { offsetY: 12, blur: 32, opacity: 0.18 },
};

const THEME_LIGHT = {
  id: 'light',
  name: 'Light（預設）',
  bg: {
    base:          PALETTE.sand[0],
    surface:       PALETTE.sand[0],
    surface_hover: PALETTE.sand[50],
    surface_dim:   '#F8F9FB',
  },
  text: {
    primary:   PALETTE.sand[900],
    secondary: PALETTE.sand[700],
    tertiary:  PALETTE.sand[600],
  },
  border: {
    base:   PALETTE.sand[200],
    strong: PALETTE.sand[300],
    input:  PALETTE.sand[500],
  },
  divider: {
    base:     PALETTE.sand[200],
    hairline: '#E5E8ED',
  },
  primary: { main: PRIMARY_PINE[800], on_main: '#FFFFFF', ...PRIMARY_PINE },
  status: {
    success:    PALETTE.semantic.success,
    success_bg: '#E0EFE0',
    success_fg: '#166534',
    warning:    PALETTE.semantic.warning,
    warning_bg: '#F7E9D7',
    warning_fg: '#92400E',
    error:      PALETTE.semantic.error,
    error_bg:   '#F7E0DB',
    error_fg:   '#991B1B',
    info:       PALETTE.semantic.info,
    info_bg:    '#DDEBEF',
    info_fg:    '#075985',
  },
  state: {
    hover:    { bg: PALETTE.sand[50] },
    selected: { bg: PRIMARY_PINE[50], fg: PRIMARY_PINE[800], border: PRIMARY_PINE[700] },
    disabled: { fg: PALETTE.sand[400], opacity: 0.45 },
    focus:    { ring: PRIMARY_PINE[700], ringWidth: 2 },
  },
  shadow: { color: PALETTE.sand[900], elevation: SHADOW_ELEVATION },
};

const THEME_DARK = {
  id: 'dark',
  name: 'Dark',
  bg: {
    base:          PALETTE.sand[950],
    surface:       PALETTE.sand[900],
    surface_hover: PALETTE.sand[800],
    surface_dim:   'rgba(255,255,255,0.04)',
  },
  text: {
    primary:   PALETTE.sand[100],
    secondary: PALETTE.sand[300],
    tertiary:  PALETTE.sand[400],
  },
  border: {
    base:   PALETTE.sand[800],
    strong: PALETTE.sand[700],
    input:  PALETTE.sand[500],
  },
  divider: {
    base:     PALETTE.sand[800],
    hairline: 'rgba(165,175,191,0.14)',
  },
  primary: { main: PRIMARY_PINE[400], on_main: PALETTE.sand[1000], ...PRIMARY_PINE },
  status: {
    success:    '#4ADE80',
    success_bg: '#293824',
    success_fg: '#4ADE80',
    warning:    '#FBBF24',
    warning_bg: '#3F3419',
    warning_fg: '#FBBF24',
    error:      '#F87171',
    error_bg:   '#3E2B23',
    error_fg:   '#F87171',
    info:       '#38BDF8',
    info_bg:    '#273433',
    info_fg:    '#38BDF8',
  },
  state: {
    hover:    { bg: PALETTE.sand[800] },
    selected: { bg: 'rgba(162,179,255,0.10)', fg: PRIMARY_PINE[300], border: PRIMARY_PINE[400] },
    disabled: { fg: PALETTE.sand[600], opacity: 0.45 },
    focus:    { ring: PRIMARY_PINE[400], ringWidth: 2 },
  },
  shadow: { color: PALETTE.sand[1000], elevation: SHADOW_ELEVATION },
};

const THEMES = { light: THEME_LIGHT, dark: THEME_DARK };
const DEFAULT_THEME_ID = 'light';
const DEFAULT_THEME = THEMES[DEFAULT_THEME_ID];

const TOKENS = {
  ink:      THEME_LIGHT.text.primary,
  ink2:     THEME_LIGHT.text.secondary,
  ink3:     THEME_LIGHT.text.tertiary,
  surface:  THEME_LIGHT.bg.surface,
  surface2: THEME_LIGHT.bg.surface_hover,
  border:   THEME_LIGHT.border.base,
  divider:  THEME_LIGHT.divider.base,
  hairline: THEME_LIGHT.divider.hairline,
  p50:  PRIMARY_PINE[50],
  p100: PRIMARY_PINE[100],
  p500: PRIMARY_PINE[500],
  p600: PRIMARY_PINE[600],
};

Object.assign(window, {
  PALETTE, PRIMARY_PINE, SHADOW_ELEVATION,
  THEME_LIGHT, THEME_DARK, THEMES, DEFAULT_THEME, DEFAULT_THEME_ID,
  TOKENS,
});
