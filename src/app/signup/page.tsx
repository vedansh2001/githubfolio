// import {
//     Card,
//     CardContent,
//     CardDescription,
//     CardFooter,
//     CardHeader,
//     CardTitle,
//   } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import Link from 'next/link'
// import prisma from "../../../db"
// import { hash } from "bcryptjs"
// import { redirect } from 'next/navigation'


// const Page = () => {
    

// const handleSignUp = async(fromData:FormData) => {
//     "use server";

//     const name = fromData.get("name") as string | undefined;
//     const email = fromData.get("email") as string | undefined;
//     const password = fromData.get("password") as string | undefined;

//     if(!email || !password || !name)
//         throw new Error("Please provide all fields");

//     const user = await prisma.user.findUnique({
//           where: {
//             email,
//           },
//     });

//     if(user) throw new Error("User already exists");

//     const hashedPassword = await hash(password, 10)

//     await prisma.user.create({
//         data: {
//             githubUsername: name,
//             email,
//             password: hashedPassword,
//         },
//     });
//     redirect("/login");
// }


//   return (
//     <div className="flex justify-center items-center h-dvh" >
//       <Card>
//         <CardHeader>
//             <CardTitle>Sign Up</CardTitle>
//             <CardDescription>Card Description</CardDescription>
//         </CardHeader>
//         <CardContent >
//           <form 
//           action={handleSignUp}
//           className='flex flex-col gap-4'>
//             <Input placeholder='Name' name="name" />
//             <Input type='email' placeholder='Email' name="email" />
//             <Input type='password' placeholder='password' name="password" />
//             <Button type='submit' >Sign Up</Button>
//           </form>

//         </CardContent>
//         <CardFooter className='flex flex-col gap-4' >
//             <span>Or</span>
//             <form action="">
//             <Button type='submit' variant={"outline"}>Login with Google</Button>
//             </form>
            
//             <Link href="/login">Already have an account? Login</Link>
//         </CardFooter>
//        </Card>

//     </div>
//   )
// }

// export default Page

import React from 'react'
import { Signup } from '../components/signup/signup'

const page = () => {
  return (
    <Signup/>
  )
}

export default page
