import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function POST(req: NextRequest) {
    try {

    const body = await req.json();
    const { email, password } = body;
    console.log("this is the email and password received : ", email , password)

    if (!email || !password) {
        return NextResponse.json(
        {
            message: "Email and password are requred.",
        },
        { status: 400 }
      );
    }
    
    // Try to find the user with the provided email and password
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    // If no user found or password doesn't match
    if (!user || user.password !== password) {
      return NextResponse.json(
        {
          message: "Email or password is incorrect.",
        },
        { status: 401 } // 401 is more appropriate for unauthorized access
      );
    }

    return NextResponse.json({ user }, { status: 200 });

    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
        { message: "Internal server error." },
        { status: 500 }
      );
    } finally {
      await prisma.$disconnect();
    }
  }