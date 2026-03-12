import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "https://searchtheverse-db.onrender.com";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q");

  const res = await fetch(
    `${BACKEND_URL}/api/search?q=${encodeURIComponent(q ?? "")}`
  );

  const data = await res.text();

  return new NextResponse(data, {
    status: res.status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}