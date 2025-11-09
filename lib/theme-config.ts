/**
 * Comprehensive Theme Configuration
 * 
 * Defines complete color schemes for all festival themes
 * Each theme includes all CSS variables used throughout the application
 */

export interface ThemeColors {
  // Core colors
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
  
  // Background and foreground
  background: string;
  foreground: string;
  
  // Card colors
  card: string;
  cardForeground: string;
  
  // Popover colors
  popover: string;
  popoverForeground: string;
  
  // Muted colors
  muted: string;
  mutedForeground: string;
  
  // Destructive colors
  destructive: string;
  destructiveForeground: string;
  
  // Border and input
  border: string;
  input: string;
  ring: string;
  
  // Chart colors (optional, for graphs/charts)
  chart1?: string;
  chart2?: string;
  chart3?: string;
  chart4?: string;
  chart5?: string;
}

export const festivalThemes: Record<string, ThemeColors> = {
  diwali: {
    // Primary: Gold/Orange
    primary: "35 100% 50%",
    primaryForeground: "0 0% 100%",
    // Secondary: Light Gold
    secondary: "45 100% 60%",
    secondaryForeground: "0 0% 10%",
    // Accent: Red
    accent: "0 100% 50%",
    accentForeground: "0 0% 100%",
    // Background: Warm white with golden tint
    background: "45 30% 98%",
    foreground: "0 0% 10%",
    // Card: Slightly warm white
    card: "45 20% 99%",
    cardForeground: "0 0% 10%",
    // Popover
    popover: "45 20% 99%",
    popoverForeground: "0 0% 10%",
    // Muted: Warm gray
    muted: "45 10% 95%",
    mutedForeground: "0 0% 45%",
    // Destructive: Deep red
    destructive: "0 84% 60%",
    destructiveForeground: "0 0% 98%",
    // Border and input: Warm gray
    border: "45 15% 90%",
    input: "45 15% 90%",
    ring: "35 100% 50%",
    // Chart colors
    chart1: "35 100% 50%",
    chart2: "45 100% 60%",
    chart3: "0 100% 50%",
    chart4: "30 100% 55%",
    chart5: "40 100% 55%",
  },
  
  holi: {
    // Primary: Pink
    primary: "300 100% 60%",
    primaryForeground: "0 0% 100%",
    // Secondary: Green
    secondary: "120 100% 50%",
    secondaryForeground: "0 0% 100%",
    // Accent: Blue
    accent: "240 100% 60%",
    accentForeground: "0 0% 100%",
    // Background: Very light pink tint
    background: "300 20% 99%",
    foreground: "0 0% 10%",
    // Card: Light pink
    card: "300 15% 98%",
    cardForeground: "0 0% 10%",
    // Popover
    popover: "300 15% 98%",
    popoverForeground: "0 0% 10%",
    // Muted: Light pink gray
    muted: "300 10% 95%",
    mutedForeground: "0 0% 45%",
    // Destructive
    destructive: "0 84% 60%",
    destructiveForeground: "0 0% 98%",
    // Border and input
    border: "300 20% 90%",
    input: "300 20% 90%",
    ring: "300 100% 60%",
    // Chart colors
    chart1: "300 100% 60%",
    chart2: "120 100% 50%",
    chart3: "240 100% 60%",
    chart4: "330 100% 65%",
    chart5: "60 100% 55%",
  },
  
  eid: {
    // Primary: Blue
    primary: "210 100% 50%",
    primaryForeground: "0 0% 100%",
    // Secondary: Green
    secondary: "150 100% 40%",
    secondaryForeground: "0 0% 100%",
    // Accent: Gold
    accent: "45 100% 50%",
    accentForeground: "0 0% 10%",
    // Background: Very light blue tint
    background: "210 20% 99%",
    foreground: "0 0% 10%",
    // Card: Light blue
    card: "210 15% 98%",
    cardForeground: "0 0% 10%",
    // Popover
    popover: "210 15% 98%",
    popoverForeground: "0 0% 10%",
    // Muted: Light blue gray
    muted: "210 10% 95%",
    mutedForeground: "0 0% 45%",
    // Destructive
    destructive: "0 84% 60%",
    destructiveForeground: "0 0% 98%",
    // Border and input
    border: "210 20% 90%",
    input: "210 20% 90%",
    ring: "210 100% 50%",
    // Chart colors
    chart1: "210 100% 50%",
    chart2: "150 100% 40%",
    chart3: "45 100% 50%",
    chart4: "200 100% 55%",
    chart5: "180 100% 50%",
  },
  
  christmas: {
    // Primary: Red
    primary: "0 100% 40%",
    primaryForeground: "0 0% 100%",
    // Secondary: Green
    secondary: "120 100% 30%",
    secondaryForeground: "0 0% 100%",
    // Accent: Gold
    accent: "45 100% 50%",
    accentForeground: "0 0% 10%",
    // Background: Very light red tint (warm white)
    background: "0 15% 99%",
    foreground: "0 0% 10%",
    // Card: Light red tint
    card: "0 10% 98%",
    cardForeground: "0 0% 10%",
    // Popover
    popover: "0 10% 98%",
    popoverForeground: "0 0% 10%",
    // Muted: Light red gray
    muted: "0 10% 95%",
    mutedForeground: "0 0% 45%",
    // Destructive
    destructive: "0 84% 60%",
    destructiveForeground: "0 0% 98%",
    // Border and input
    border: "0 20% 90%",
    input: "0 20% 90%",
    ring: "0 100% 40%",
    // Chart colors
    chart1: "0 100% 40%",
    chart2: "120 100% 30%",
    chart3: "45 100% 50%",
    chart4: "15 100% 45%",
    chart5: "30 100% 45%",
  },
  
  newyear: {
    // Primary: Purple
    primary: "280 100% 60%",
    primaryForeground: "0 0% 100%",
    // Secondary: Cyan
    secondary: "200 100% 50%",
    secondaryForeground: "0 0% 10%",
    // Accent: White
    accent: "0 0% 100%",
    accentForeground: "0 0% 10%",
    // Background: Very light purple tint
    background: "280 20% 99%",
    foreground: "0 0% 10%",
    // Card: Light purple
    card: "280 15% 98%",
    cardForeground: "0 0% 10%",
    // Popover
    popover: "280 15% 98%",
    popoverForeground: "0 0% 10%",
    // Muted: Light purple gray
    muted: "280 10% 95%",
    mutedForeground: "0 0% 45%",
    // Destructive
    destructive: "0 84% 60%",
    destructiveForeground: "0 0% 98%",
    // Border and input
    border: "280 20% 90%",
    input: "280 20% 90%",
    ring: "280 100% 60%",
    // Chart colors
    chart1: "280 100% 60%",
    chart2: "200 100% 50%",
    chart3: "320 100% 65%",
    chart4: "240 100% 60%",
    chart5: "260 100% 55%",
  },
};

/**
 * Apply a comprehensive theme to the document root
 */
export function applyTheme(root: HTMLElement, themeName: string) {
  const theme = festivalThemes[themeName];
  if (!theme) return;

  // Apply all CSS variables
  root.style.setProperty("--primary", theme.primary);
  root.style.setProperty("--primary-foreground", theme.primaryForeground);
  root.style.setProperty("--secondary", theme.secondary);
  root.style.setProperty("--secondary-foreground", theme.secondaryForeground);
  root.style.setProperty("--accent", theme.accent);
  root.style.setProperty("--accent-foreground", theme.accentForeground);
  root.style.setProperty("--background", theme.background);
  root.style.setProperty("--foreground", theme.foreground);
  root.style.setProperty("--card", theme.card);
  root.style.setProperty("--card-foreground", theme.cardForeground);
  root.style.setProperty("--popover", theme.popover);
  root.style.setProperty("--popover-foreground", theme.popoverForeground);
  root.style.setProperty("--muted", theme.muted);
  root.style.setProperty("--muted-foreground", theme.mutedForeground);
  root.style.setProperty("--destructive", theme.destructive);
  root.style.setProperty("--destructive-foreground", theme.destructiveForeground);
  root.style.setProperty("--border", theme.border);
  root.style.setProperty("--input", theme.input);
  root.style.setProperty("--ring", theme.ring);
  
  // Optional chart colors
  if (theme.chart1) root.style.setProperty("--chart-1", theme.chart1);
  if (theme.chart2) root.style.setProperty("--chart-2", theme.chart2);
  if (theme.chart3) root.style.setProperty("--chart-3", theme.chart3);
  if (theme.chart4) root.style.setProperty("--chart-4", theme.chart4);
  if (theme.chart5) root.style.setProperty("--chart-5", theme.chart5);
}

