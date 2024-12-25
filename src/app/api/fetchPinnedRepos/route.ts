import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
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