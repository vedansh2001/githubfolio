import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PUT(req: NextRequest) {
    try {
        const idString = req.nextUrl.searchParams.get('Id'); 

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