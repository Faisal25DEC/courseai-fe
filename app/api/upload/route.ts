import { NextRequest, NextResponse } from "next/server";
import Mux from "@mux/mux-node";

const { Video } = new Mux(
  process.env.MUX_TOKEN_ID as string,
  process.env.MUX_TOKEN_SECRET as string
);

export async function POST(req: NextRequest) {
  try {
    const upload = await Video.Uploads.create({
      new_asset_settings: {
        playback_policy: "public",
        input: [
          {
            url: "",
            generated_subtitles: [
              {
                language_code: "en",
                name: "English CC",
              },
            ],
          },
        ],
        encoding_tier: "smart",
      },
      cors_origin: "*",
    });

    return NextResponse.json({
      id: upload.id,
      url: upload.url,
    });
  } catch (e) {
    console.error("Request error", e);
    return NextResponse.json(
      { error: "Error creating upload" },
      { status: 500 }
    );
  }
}
