import { NextRequest, NextResponse } from "next/server";
import Mux from "@mux/mux-node";

const { Video } = new Mux(
  process.env.MUX_TOKEN_ID as string,
  process.env.MUX_TOKEN_SECRET as string
);

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { searchParams } = new URL(req.url);

  const { id } = params;
  if (!id) {
    return NextResponse.json(
      { error: "Missing id parameter" },
      { status: 400 }
    );
  }

  try {
    const asset = await Video.Assets.get(id);
    return NextResponse.json({
      asset: {
        id: asset.id,
        status: asset.status,
        errors: asset.errors,
        playback_id: asset.playback_ids ? asset.playback_ids[0].id : null,
      },
    });
  } catch (e) {
    console.error("Request error", e);
    return NextResponse.json(
      { error: "Error getting upload/asset" },
      { status: 500 }
    );
  }
}
