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

    // If button is clicked, save data silently and return nothing
    if (buttonClicked) {
      try {
        await fetch(`http://51.21.185.220/analyze`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: githubUsername }),
        }).then(async (response) => {
          if (!response.ok) throw new Error(`Failed to fetch analysis: ${response.status}`);
          const { data: aiData } = await response.json();
          await prisma.user.update({
            where: { githubUsername },
            data: { aiReview: aiData },
          });
        }).catch((error) => {
          console.error("Silent error during AI fetch:", error);
        });

        // Don't return anything to the frontend
        return new Response(null, { status: 204 }); // No Content
      } catch (error) {
        console.error("Error saving data silently:", error);
        return new Response(null, { status: 204 }); // Still return no content
      }
    }

    // Return existing review if available
    if (user.aiReview) {
      return NextResponse.json(
        { aiReview: user.aiReview },
        {
          status: 200,
          headers: { "Cache-Control": "no-store" },
        }
      );
    }

    return NextResponse.json(
      { message: "No analysis found. Click the button to generate a review." },
      {
        status: 200,
        headers: { "Cache-Control": "no-store" },
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
