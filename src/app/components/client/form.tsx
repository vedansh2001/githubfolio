// "use server"

// import { signIn } from "@/auth";

// export async function handleGithubLogin() {
//     await signIn("github");
// }

// // app/login/page.tsx
// import {
//     Card,
//     CardContent,
//     CardDescription,
//     CardFooter,
//     CardHeader,
//     CardTitle,
// } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import Link from 'next/link'
// // import { LoginForm } from '../components/client/form'
// import { auth } from "@/auth"
// import { redirect } from "next/navigation"
// // import { handleGithubLogin } from "../actions/auth"

// const Page = async () => {
//     const session = await auth();

//     if (session?.user) {
//         const url = session?.user?.githubUsername;
//         redirect(`/${url}`);
//     }

//     return (
//         <div className="flex justify-center items-center h-dvh">
//             <Card>
//                 <CardHeader>
//                     <CardTitle>Login</CardTitle>
//                     <CardDescription>Card Description</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                     <LoginForm />
//                 </CardContent>
//                 <CardFooter className='flex flex-col gap-4'>
//                     <span>Or</span>
//                     <form 
//                         action={handleGithubLogin}>
//                         <Button type="submit" 
//                         variant="outline"
//                         >
//                             Login with Github
//                         </Button>
//                     </form>
//                     <Link href="/signup">Don't have an account? Signup</Link>
//                 </CardFooter>
//             </Card>
//         </div>
//     );
// }

// export default Page;