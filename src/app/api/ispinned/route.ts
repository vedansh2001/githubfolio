import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PUT(req: NextRequest) {
  const disconnectPrisma = async () => await prisma.$disconnect();

  try {
    const idString = req.nextUrl.searchParams.get("Id");
    const action = req.nextUrl.searchParams.get("action"); // 'pin' or 'unpin'

    // Validate 'Id' and 'action' parameters
    if (!idString || !action) {
      console.error("Missing parameters:", { idString, action });
      return NextResponse.json(
        { message: "Repository ID and action are required." },
        { status: 400 }
      );
    }

    const id = parseInt(idString, 10);
    if (isNaN(id)) {
      console.error("Invalid ID format:", idString);
      return NextResponse.json(
        { message: "Invalid Repository ID format." },
        { status: 400 }
      );
    }

    // Validate the 'action' parameter
    if (!["pin", "unpin"].includes(action)) {
      console.error("Invalid action:", action);
      return NextResponse.json(
        { message: "Invalid action specified." },
        { status: 400 }
      );
    }

    const isPinned = action === "pin";
    console.log(`Updating repository ID ${id} to isPinned=${isPinned}`);

    const updatedRepo = await prisma.repository.update({
      where: { id },
      data: { isPinned },
    });

    const pinnedRepos = await prisma.repository.findMany({
      where: { isPinned: true },
    });


    return NextResponse.json({
      message: `Repository with ID ${id} has been ${
        isPinned ? "pinned" : "unpinned"
      }.`,
      pinnedRepos: pinnedRepos,
    });
  } catch (error) {
    console.error("Error in PUT handler:", error);
    return NextResponse.json(
      { message: "An error occurred while processing your request." },
      { status: 500 }
    );
  } finally {
    await disconnectPrisma();
  }
}

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