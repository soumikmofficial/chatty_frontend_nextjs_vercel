import { NextResponse, NextRequest } from "next/server";

export default function middleware(req: NextRequest) {
  const url = req.url;

  const token = req.cookies.get("accessToken");

  if (url.includes("/chat")) {
    if (!token) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_ORIGIN}/auth`);
    }
  }
}
