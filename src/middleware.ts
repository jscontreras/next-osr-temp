import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const DEFAULT_LANG = 'en';

export const extractLocaleFromUrl = (urlString: string) => {
  const url = new URL(urlString);
  const pathParts = url.pathname.split('/');
  const pathLocale = pathParts[1];
  const locale = pathLocale?.toLowerCase() || '';
  return /^([a-z]{2}(-[a-z]{2})?)?$/.test(locale) ? locale : undefined;
};

export default async function middleware(req: NextRequest) {
  const urlLocale = extractLocaleFromUrl(req.url);

  if (urlLocale) {
    return NextResponse.next();
  }

  return NextResponse.redirect(
    new URL(
      `${req.nextUrl.origin}/${urlLocale || DEFAULT_LANG}${req.nextUrl.pathname}`
    )
  );
}

export const config = {
  matcher: [
    '/',
    '/((?!api/|_next/|feaas-render|healthz|sitecore/api/|-/|favicon.ico|sc_logo.svg).*)',
  ],
};
