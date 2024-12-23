
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest){
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: "vedanshm2001@gmail.com"
            }
        });

        const userRepo = await prisma.repository.findMany({
            where: {
                userId: user.id
            }
        });
        if (!user) {
            return NextResponse.json(
              {
                message: "User not found",
              },
              { status: 404 }
            );
        }

        const selectedRepos = await prisma.repository.findMany({
            where: {
                isSelected: true,
            },
        })
        return NextResponse.json({ userRepo, selectedRepos}, { status: 200 });

        
    }catch (error) {
        console.error("Error:", error);
    
        // Return error response
        return NextResponse.json(
          { message: "An error occurred while processing your request." },
          { status: 500 }
        );
      } finally {
        await prisma.$disconnect(); // Close Prisma Client connection
      }
    }

export async function POST(req:NextRequest) {
    try {
        const idString = req.nextUrl.searchParams.get('Id'); // Use searchParams to get query parameters

        const id = parseInt(idString, 10);

        
        
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
    
        const updatedRepository = await prisma.repository.update({
          where: {
            id: id, // Find by the repo name
          },
          data: {
            isSelected: true, // Update the isSelected field
          },
        });
        

        const selectedRepos = await prisma.repository.findMany({
            where: {
                isSelected: true,
            },
        })
    
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
        await prisma.$disconnect(); // Close Prisma Client connection
      }
    }