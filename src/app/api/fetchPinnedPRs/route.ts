import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET(_: NextRequest) {
    try {
        
        const isPinnedToShowInPinnedSection = await prisma.pullRequest.findMany({
            where: {
                isPinned: true,
            },
        })
        return new NextResponse(JSON.stringify({
            isPinnedToShowInPinnedSection
        }), {
            headers: {
                'Cache-Control': 'no-store, max-age=0',
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error("Error in GET handler:", error);
        return NextResponse.json(
          { message: "An error occurred while processing your request." },
          { status: 500 }
        );
      } finally {
        await prisma.$disconnect();
      }
    }