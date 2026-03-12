import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "https://searchtheverse-db.onrender.com";

export async function GET(request: NextRequest) {
  const ref = request.nextUrl.searchParams.get("ref");

  const res = await fetch(
    `${BACKEND_URL}/api/passage?ref=${encodeURIComponent(ref ?? "")}`
  );

  const data = await res.text();

  return new NextResponse(data, {
    status: res.status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}