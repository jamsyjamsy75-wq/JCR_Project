import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { mediaCategories } from "@/lib/mediaCatalog";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { id: "asc" },
    });

    if (!categories.length) {
      return NextResponse.json({
        data: mediaCategories,
        meta: { fallback: true },
      });
    }

    return NextResponse.json({
      data: categories.map((category) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
      })),
    });
  } catch (error) {
    console.error("[GET /api/categories]", error);
    return NextResponse.json({
      data: mediaCategories,
      meta: { fallback: true },
    });
  }
}


