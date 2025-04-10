import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const githubUsername = searchParams.get("githubUsername");
  const buttonClicked = searchParams.get("buttonClicked") === "true";
  
  console.log("Button click request:", { githubUsername, buttonClicked });

  if (!githubUsername) {
    return NextResponse.json({ message: "GithubUsername is required" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { githubUsername },
    });
    
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Return existing review if available
    if (user.aiReview) {
      return NextResponse.json(
        { aiReview: user.aiReview },
        {
          status: 200,
          headers: { "Cache-Control": "no-store" }
        }
      );
    }

    // Generate new review only if button was clicked
    if (buttonClicked) {
      try {
        // const apiBaseUrl = process.env.AI_SERVER_URL;
        
        const response = await fetch(`http://51.21.185.220/analyze`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: githubUsername }),
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch analysis: ${response.status}`);
        }

        const { data: aiData } = await response.json();

        await prisma.user.update({
          where: { githubUsername },
          data: { aiReview: aiData },
        });

        return NextResponse.json({ aiReview: aiData }, { status: 200 });
      } catch (error) {
        console.error("Error fetching AI review:", error);
        return NextResponse.json(
          { message: "Failed to generate AI review", error: (error as Error).message },
          { status: 500 }
        );
      }
    }

    // User hasn't clicked the button and no existing review
    return NextResponse.json(
      { message: "No analysis found. Click the button to generate a review." },
      {
        status: 200,
        headers: { "Cache-Control": "no-store" }
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { message: "An error occurred while processing your request." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}