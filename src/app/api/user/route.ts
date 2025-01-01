import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

// Define the type for the GitHub repository data
interface GitHubRepo {
  name: string;
  html_url: string;
  description: string | null;
  created_at: string;
}

// Function for saving user data in PostgreSQL
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // First check if email or githubUsername already exists?
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: body.email },
          { githubUsername: body.githubUsername }
        ]
      }
    });
    if (existingUser) {
      return NextResponse.json({
        message: existingUser.email === body.email 
          ? "Email already registered" 
          : "GitHub username already registered"
      }, { status: 409 }); // 409 Conflict status code
    }

    // Fetch user data (like avatar, bio, followers etc) from GitHub API
    const githubResponse = await fetch(`https://api.github.com/users/${body.githubUsername}`);
    if (!githubResponse.ok) {
      return NextResponse.json(
        { message: "Invalid GitHub username." },
        { status: 400 }
      );
    }
    
    const githubData = await githubResponse.json();

    // Create a new user in the database with the data (like avatar, bio, followers etc) fetched (just above) from GitHub
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

    // Fetch repositories of the user from GitHub 
    const githubRepos = await fetch(`https://api.github.com/users/${body.githubUsername}/repos`);
    if (!githubRepos.ok) {
      return NextResponse.json(
        { message: "Failed to fetch Repository details. Please try again" },
        { status: 400 }
      );
    }

    const githubReposData: GitHubRepo[] = await githubRepos.json();

    // Create repositories and associate them with the user
    const repositoryPromises = githubReposData.map((repo) =>
      prisma.repository.create({
        data: {
          name: repo.name,
          link: repo.html_url,
          description: repo.description || "No description",
          createdAt: new Date(repo.created_at),
          user: {
            connect: { id: user.id }, 
          },
        },
      })
    );

    await Promise.all(repositoryPromises);

    return NextResponse.json({ message: "User created successfully!" }, { status: 201 });

  } catch (error) {
    console.error("Error:", error);

    return NextResponse.json(
      { message: "An error occurred while processing your request." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect(); // Close Prisma Client connection
  }
}

// Function for retrieving data from PostgreSQL
export async function GET() {
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
