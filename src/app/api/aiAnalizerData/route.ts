import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

// Handle CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

// Fire-and-forget background processing function
async function handleBackgroundTask(githubUsername: string) {
  try {
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

    console.log("AI analysis saved successfully for", githubUsername);
  } catch (error) {
    console.error("Error in background task:", error);
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const githubUsername = searchParams.get("githubUsername");
  const buttonClicked = searchParams.get("buttonClicked") === "true";

  console.log("Button click request:", { githubUsername, buttonClicked });

  if (!githubUsername) {
    return NextResponse.json(
      { message: "GithubUsername is required" },
      {
        status: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
      }
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { githubUsername },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        {
          status: 404,
          headers: { "Access-Control-Allow-Origin": "*" },
        }
      );
    }

    if (buttonClicked) {
      handleBackgroundTask(githubUsername); // don't await
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    if (user.aiReview) {
      return NextResponse.json(
        { aiReview: user.aiReview },
        {
          status: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "no-store",
          },
        }
      );
    }

    return NextResponse.json(
      { message: "No analysis found. Click the button to generate a review." },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { message: "An error occurred while processing your request." },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } finally {
    await prisma.$disconnect();
  }
}
