import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "https://searchtheverse-db.onrender.com";

export async function GET(request: NextRequest) {
  const bookOrder = request.nextUrl.searchParams.get("bookOrder");
  const chapter = request.nextUrl.searchParams.get("chapter");

  const res = await fetch(
    `${BACKEND_URL}/api/chapter?bookOrder=${encodeURIComponent(bookOrder ?? "")}&chapter=${encodeURIComponent(chapter ?? "")}`
  );

  const data = await res.text();

  return new NextResponse(data, {
    status: res.status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}