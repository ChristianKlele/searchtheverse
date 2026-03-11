import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const bookOrder = request.nextUrl.searchParams.get("bookOrder");
  const chapter = request.nextUrl.searchParams.get("chapter");

  const res = await fetch(
    `http://127.0.0.1:8080/api/chapter?bookOrder=${encodeURIComponent(bookOrder ?? "")}&chapter=${encodeURIComponent(chapter ?? "")}`
  );

  const data = await res.text();

  return new NextResponse(data, {
    status: res.status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}