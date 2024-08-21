import { NextResponse } from "next/server";

export function middleware(request) {
  const startWithChannelregExp = /^\/\d{3}/;
  if (startWithChannelregExp.test(request.nextUrl.pathname)) {
    return NextResponse.rewrite(request.url.replace(/\/\d{3}/, ""));
  }
  return NextResponse.next();
}
