import { NextRequest, NextResponse } from "next/server";
import { generateJokes } from "@/lib/openrouter";
import { VALID_CATEGORY_IDS } from "@/lib/constants";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { category, keyword } = body;

    // Validate category if provided
    if (category && !VALID_CATEGORY_IDS.has(category)) {
      return NextResponse.json(
        { error: "Kategori tidak valid." },
        { status: 400 }
      );
    }

    // Validate keyword if provided
    if (keyword && (typeof keyword !== "string" || keyword.length > 100)) {
      return NextResponse.json(
        { error: "Kata kunci terlalu panjang (maks 100 karakter)." },
        { status: 400 }
      );
    }

    const jokes = await generateJokes(category, keyword);
    return NextResponse.json({ jokes });
  } catch (error) {
    console.error("Generate jokes error:", error);
    return NextResponse.json(
      { error: "Waduh, jokes-nya lagi ngadat. Coba lagi ya, Pak!" },
      { status: 500 }
    );
  }
}
