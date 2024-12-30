import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET(req: NextRequest) {
  try {
    // Parse query parameters from req.url
    const url = new URL(req.url);
    const id = url.searchParams.get("userId");

    if (!id) {
      return NextResponse.json(
        { message: "userId is required." },
        { status: 400 }
      );
    }

    const userId = parseInt(id, 10);

    if (isNaN(userId)) {
      return NextResponse.json(
        { message: "Invalid user ID format." },
        { status: 400 }
      );
    }

    const selectedPRs = await prisma.pullRequest.findMany({
      where: {
        userId,
      },
    });

    return NextResponse.json({ selectedPRs }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);

    return NextResponse.json(
      { message: "An error occurred while processing your request." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
