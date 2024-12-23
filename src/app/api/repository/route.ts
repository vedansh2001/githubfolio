
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

//this function will fetch the user repositories as well as selected repos
export async function GET(_: NextRequest){
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: "vedanshm2001@gmail.com"
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

        const userRepo = await prisma.repository.findMany({
            where: {
                userId: user.id
            }
        });

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
        const idString = req.nextUrl.searchParams.get('Id'); 
        
        if (!idString) {
          return NextResponse.json(
            { message: "Repository name is required." },
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