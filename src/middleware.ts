import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

const DEFAULT_LANG = 'en';

export const extractLocaleFromUrl = (urlString: string) => {
  const url = new URL(urlString);
  const pathParts = url.pathname.split('/');
  const pathLocale = pathParts[1];
  const locale = pathLocale?.toLowerCase() || '';
  return /^([a-z]{2}(-[a-z]{2})?)?$/.test(locale) ? locale : undefined;
};

export default async function middleware(req: NextRequest) {
  const request = req;
  const urlLocale = extractLocaleFromUrl(req.url);

  if (urlLocale) {
    if (!req.headers.has('x-Routed')) {
      const newURl = `/${urlLocale}/blog${request.nextUrl.pathname.replace(/\/\/$/g, '/')}${request.nextUrl.search}`
      const nextUrl = new URL(
        newURl,
        request.url,
      );
      const response =  NextResponse.rewrite(nextUrl, { request });
      response.headers.set('x-Routed', 'true');
      return response;
    }
    // return NextResponse.next();
  } else {
    return NextResponse.redirect(
      new URL(
        `${req.nextUrl.origin}/${urlLocale || DEFAULT_LANG}${req.nextUrl.pathname}`
      )
    );
  }



}

export const config = {
  matcher: [
    '/',
    '/((?!api/|_next/|feaas-render|healthz|sitecore/api/|-/|favicon.ico|sc_logo.svg).*)',
  ],
};
