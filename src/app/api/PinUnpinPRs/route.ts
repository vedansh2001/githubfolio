import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
 

export async function PUT(req: NextRequest) {
    const disconnectPrisma = async () => await prisma.$disconnect();
  
    try {
      const idString = req.nextUrl.searchParams.get("Id");
      const action = req.nextUrl.searchParams.get("action"); // 'pin' or 'unpin'
      const username = req.nextUrl.searchParams.get("username")
  
      // Validate 'Id' and 'action' parameters
      if (!idString || !action) {
        console.error("Missing parameters:", { idString, action });
        return NextResponse.json(
          { message: "Repository ID and action are required." },
          { status: 400 }
        );
      }

      if (!username) {
          return NextResponse.json({ message: "Username is required" }, { status: 400 });
        }
        
        const user = await prisma.user.findUnique({
            where: {
              githubUsername: username,
            },
        });
        if (!user) {
          return NextResponse.json(
            {
              message: "User not found",
            },
            { status: 404 }
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
  
      await prisma.pullRequest.update({
        where: { id },
        data: { isPinned },
      });
  
      const pinnedPRs = await prisma.pullRequest.findMany({
        where: { 
          userId: user.id,
          isPinned: true
         },
      });
  
  
      return NextResponse.json({
        message: `PR with ID ${id} has been ${
          isPinned ? "pinned" : "unpinned"
        }.`,
        pinnedPRs: pinnedPRs,
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
  