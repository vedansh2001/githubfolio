export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET(req: NextRequest) {
  try {
    // Parse query parameters from req.url
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('userId');

    // const params = new URLSearchParams(window.location.search);
    // const id = params.get('data');
    // console.log("id is here ",id);
    


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
