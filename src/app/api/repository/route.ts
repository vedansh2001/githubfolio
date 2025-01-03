
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";


//this function will fetch the user repositories as well as selected repos
export async function GET(req: NextRequest){
  const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");
    console.log("this is the username just after receiving form props :::::", username);
    
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
    // console.log("hello mister this is user information fetched", user.id);
    try {
        const user = await prisma.user.findUnique({
            where: {
              githubUsername: username,
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
                userId: user.id,
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
            id: id, // Find by the repo id
          },
          data: {
            isSelected: true, // Update the isSelected field
          },
        });
        

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
    
        // Return error response
        return NextResponse.json(
          { message: "An error occurred while processing your request." },
          { status: 500 }
        );
      } finally {
        await prisma.$disconnect(); // Close Prisma Client connection
      }
    }