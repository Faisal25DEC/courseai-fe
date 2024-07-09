import { NextRequest, NextResponse } from "next/server";

const NEXT_PUBLIC_HEYGEN_API_KEY = process.env.NEXT_PUBLIC_HEYGEN_API_KEY;

export async function POST(
  request: NextRequest,
  response: NextResponse
) {
  try {
    if (!NEXT_PUBLIC_HEYGEN_API_KEY) {
      throw new Error("API key is missing from .env");
    }

    const res = await fetch(
      "https://api.heygen.com/v1/streaming.create_token",
      {
        method: "POST",
        headers: {
          "x-api-key": NEXT_PUBLIC_HEYGEN_API_KEY,
        },
      }
    );
    const data = await res.json();

    // return new Response(data.data.token, {
    //     status: 200,
    // });
    return NextResponse.json({ token: data.data.token });
  } catch (error) {
    console.error("Error retrieving access token:", error);

    return NextResponse.json({ error: "Error retrieving access token" });
  }
}
