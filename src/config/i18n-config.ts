export const locales = ['en', 'en-ca'] as const;
export const defaultLocale = 'en' as const;

export type Locale = (typeof locales)[number];
