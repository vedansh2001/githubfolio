import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { compare } from "bcryptjs";

export async function POST(req: NextRequest) {
    try {

    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
        return NextResponse.json(
        {
            message: "Email and password are required.",
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

    // Verify the password against the stored hash
    if(user?.password){
    const isPasswordValid = await compare(password, user.password);
    console.log("this is passowrd:", password, "this is user.password", user.password);
    
    // If password doesn't match
    if (!isPasswordValid) {
      return NextResponse.json(
          {
              message: "Email or password is incorrect.",
          },
          { status: 401 }
      );
      }
    }
        


    const username = user?.githubUsername; 
    const { password: _, ...userWithoutPassword } = user;
    console.log("random", _)
    return NextResponse.json({ user: userWithoutPassword, username }, { status: 200 });   

    // return NextResponse.json({ user, username }, { status: 200 });

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