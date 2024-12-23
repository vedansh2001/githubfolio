import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PUT(req: NextRequest) {
    try {
        const idString = req.nextUrl.searchParams.get('Id'); 

        const id = parseInt(idString, 10);
        console.log("Step 1 : repoName is : ", id);
        if (!idString) {
            return NextResponse.json(
              { message: "Repository name is required." },
              { status: 400 }
            );
          }
  
          if (isNaN(id)) {
          return NextResponse.json(
              { message: "Invalid Repository ID format." },
              { status: 400 }
          );
          }
        const deleteUser = await prisma.repository.update({
            where: {
                id: id, 
            },
            data: {
              isSelected: false,
            },
        })
        console.log("Step 2: Updated the ",id, "repository to false");

        const selectedRepos = await prisma.repository.findMany({
            where: {
                isSelected: true,
            },
        })
        console.log("Step 3, These are the selected Repos:",selectedRepos)

        return NextResponse.json({
            message: `Repository with ${id} updated successfully!`,
            selectedRepos: selectedRepos,
        });
        
    } catch (error) {
            console.error("Error:", error);
        
            // Return error response
            return NextResponse.json(
              { message: "An error occurred while processing your request." },
              { status: 500 }
            );
          } finally {
            await prisma.$disconnect();
          }
        }