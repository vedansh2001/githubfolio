import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET(_: NextRequest) {
    try {
        
        const isPinnedToShowInPinnedSection = await prisma.repository.findMany({
            where: {
                isPinned: true,
            },
        })
        return NextResponse.json({
            isPinnedToShowInPinnedSection: isPinnedToShowInPinnedSection,
        });
    } catch (error) {
        console.error("Error in PUT handler:", error);
        return NextResponse.json(
          { message: "An error occurred while processing your request." },
          { status: 500 }
        );
      } finally {
        await prisma.$disconnect();
      }
    }