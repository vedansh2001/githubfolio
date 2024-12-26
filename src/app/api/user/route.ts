import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

// Function for saving user data in PostgreSQL
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Fetch data from GitHub API
    const githubResponse = await fetch(`https://api.github.com/users/${body.githubUsername}`);
    if (!githubResponse.ok) {
      return NextResponse.json(
        { message: "Failed to fetch GitHub details." },
        { status: 400 }
      );
    }
    const githubData = await githubResponse.json();

    // Create a new user in the database
    const user = await prisma.user.create({
      data: {
        name: body.name || githubData.name,
        githubUsername: body.githubUsername,
        email: body.email,
        password: body.password,
        bio: githubData.bio,
        location: githubData.location,
        followers: githubData.followers || 0,
        following: githubData.following || 0,
        publicRepos: githubData.public_repos || 0,
        imageURL: githubData.avatar_url,
      },
    });

    // Fetch repositories from GitHub API
    const githubRepos = await fetch(`https://api.github.com/users/${body.githubUsername}/repos`);
    if (!githubRepos.ok) {
      return NextResponse.json(
        { message: "Failed to fetch Repository details." },
        { status: 400 }
      );
    }

    const githubReposData = await githubRepos.json();

    // Create repositories and associate them with the user
    const repositoryPromises = githubReposData.map((repo: any) =>
      prisma.repository.create({
        data: {
          name: repo.name,
          link: repo.html_url,
          description: repo.description || "No description",
          createdAt: new Date(repo.created_at),
          user: {
            connect: { id: user.id }, // Use the user ID from the created user
          },
        },
      })
    );

    await Promise.all(repositoryPromises);

    // Redirect to the home page after successful sign-in
const origin = req.nextUrl.origin; // Extract the origin from the request
return NextResponse.redirect(`${origin}/`, { status: 303 });

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

// Function for retrieving data from PostgreSQL
export async function GET(req: NextRequest) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: "vedanshm2001@gmail.com",
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
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching user data." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
