import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const ref = request.nextUrl.searchParams.get("ref");

  const res = await fetch(
    `http://127.0.0.1:8080/api/passage?ref=${encodeURIComponent(ref ?? "")}`
  );

  const data = await res.text();

  return new NextResponse(data, {
    status: res.status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}