import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { I18nProvider } from 'next-localization';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const locale = router.locale || 'en';
  console.log('router', router)

  return (
    <I18nProvider lngDict={pageProps.lngDict} locale={locale}>
      <Component {...pageProps} />
    </I18nProvider>
  );
}
