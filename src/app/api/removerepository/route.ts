import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function PUT(req: NextRequest) {
    try {
        const idString = req.nextUrl.searchParams.get('Id'); 
        const username = req.nextUrl.searchParams.get('username'); 

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

        if (!idString) {
            return NextResponse.json(
              { message: "Repository id is required." },
              { status: 400 }
            );
        }
        
        const id = parseInt(idString, 10);
    
        if (isNaN(id)) {
            return NextResponse.json(
              { message: "Invalid Repository ID format." },
              { status: 400 }
            );
        }
        await prisma.repository.update({
            where: {
                id: id, 
            },
            data: {
              isSelected: false,
            },
        })

        const selectedRepos = await prisma.repository.findMany({
            where: {
                userId: user.id,
                isSelected: true,
            },
        })

        return NextResponse.json({
            message: `Repository with ${id} updated successfully!`,
            selectedRepos: selectedRepos,
        });
        
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