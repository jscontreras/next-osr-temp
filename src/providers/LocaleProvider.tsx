import { I18nProvider } from 'next-localization';
import { PropsWithChildren } from 'react';

interface LocaleProviderProps extends PropsWithChildren {
  lngDict: Record<string, string | number>;
  locale: string;
}

export default function LocaleProvider({
  children,
  lngDict,
  locale,
}: Readonly<LocaleProviderProps>) {
  return (
    <I18nProvider lngDict={lngDict} locale={locale}>
      <>{children}</>
    </I18nProvider>
  );
}
