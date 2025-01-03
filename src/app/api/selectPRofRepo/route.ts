import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function POST(req: NextRequest) {
    try {
      const body = await req.json();
      // console.log("this is the body ypu wanted to print ok ????????????????????????????", body);
      
  
      if (
        !body.title ||
        !body.number ||
        !body.html_url ||
        !body.state ||
        !body.full_name ||
        !body.userId || // Ensure userId is present
        !body.repositoryId // Ensure repositoryId is present
      ) {
        return NextResponse.json(
          { message: "Invalid data. Please provide all required fields." },
          { status: 400 }
        );
      }
      const Id = parseInt(body.userId, 10);
      console.log("this is the Id of the user: ", Id, "and its type is: ", typeof(Id));
      

      if (isNaN(Id)) {
        return NextResponse.json(
          { message: "Invalid user ID format." },
          { status: 400 }
        );
      }
  
      await prisma.pullRequest.create({
        data: {
          name: body.title,
          link: body.html_url,
          state: body.state,
          full_name: body.full_name,
          number: body.number,
          userId: Id, // Add userId
          repositoryId: body.repositoryId, // Add repositoryId
        },
      });
      // await prisma.pullRequest.update({
      //   where: { id: body.repoId },
      //   data: { isSelected },
      // });

       // Fetch all PRs for the user
        const allPRs = await prisma.pullRequest.findMany({
          where: { userId: Id },
        });
        console.log("this is allPRs: ", allPRs);
        
  
      return NextResponse.json(
        { message: "PR added successfully", data: allPRs },
        { status: 201 }
      );
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
  