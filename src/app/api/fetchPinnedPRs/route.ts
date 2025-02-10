import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");
    
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

    try {        
        const isPinnedToShowInPinnedSection = await prisma.pullRequest.findMany({
            where: {
                userId:user.id,
                isPinned: true,
            },
        })
        return new NextResponse(JSON.stringify({
            isPinnedToShowInPinnedSection
        }), {
            headers: {
                'Cache-Control': 'no-store, max-age=0',
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error("Error in GET handler:", error);
        return NextResponse.json(
          { message: "An error occurred while processing your request." },
          { status: 500 }
        );
      } finally {
        await prisma.$disconnect();
      }
    }