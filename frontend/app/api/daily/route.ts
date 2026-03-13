import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "https://searchtheverse-db.onrender.com";

export async function GET(_request: NextRequest) {
  const res = await fetch(`${BACKEND_URL}/api/daily`, {
    cache: "no-store",
  });

  const data = await res.text();

  return new NextResponse(data, {
    status: res.status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
