import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { scrapeFireNews } from "@/lib/scraper";

/**
 * POST /api/blog/scrape - trigger fire news scraping (admin only)
 */
export async function POST() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const result = await scrapeFireNews();

    return NextResponse.json({
      success: true,
      message: `Scraping complete: ${result.added} new articles added, ${result.skipped} duplicates skipped`,
      ...result,
    });
  } catch (error) {
    console.error("POST /api/blog/scrape error:", error);
    return NextResponse.json({ error: "Scraping failed" }, { status: 500 });
  }
}
