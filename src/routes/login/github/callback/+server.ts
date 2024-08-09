import { OAuth2RequestError } from "arctic";
import { github, lucia } from "$lib/server/lucia";
import prisma from "$lib/server/prisma";
import type { RequestEvent } from "@sveltejs/kit";

export async function GET(event:RequestEvent): Promise<Response>{
   const code = event.url.searchParams.get('code');
   const state = event.url.searchParams.get('state');
   const storedState = event.cookies.get('github_oauth_state') ?? null;
   if (!code || !state || !storedState || state !== storedState){
      return new Response(null, {
         status: 400
      })
   }
   try {
      const tokens = await github.validateAuthorizationCode(code)
      const githubUserResponse = await fetch('https://api.github.com/user',{
         headers: {
            Authorization: `Bearer ${tokens.accessToken}`
         }
      });
      
      const githubUser:GitHubUser = await githubUserResponse.json();

      const existingUser = await prisma.user.findUnique({
         where:{
            githubId: githubUser.id
         }
      })
      if(existingUser){
         const session = await lucia.createSession(existingUser.id, {});
         const sessionCookie = await lucia.createSessionCookie(session.id);
         event.cookies.set(sessionCookie.name, sessionCookie.value,{
            path: '.',
            ...sessionCookie.attributes
         });
      } else {
         const createdUser = await prisma.user.create({
            data:{
               githubId: githubUser.id,
               githubUsername: githubUser.login
            }
         })
         const session = await lucia.createSession(createdUser.id, {})
         const sessionCookie = await lucia.createSessionCookie(session.id);
         event.cookies.set(sessionCookie.name, sessionCookie.value,{
            path: '.',
            ...sessionCookie.attributes
         });
      }
      return new Response(null, {
         status: 302, 
         headers: {
            Location: '/'
         }
      })
   } 
   catch (error) {
      if( error instanceof OAuth2RequestError ){
         return new Response(null, {status: 400});
      }
      return new Response(null, {status: 500} )
   }
}


interface GitHubUser {
	id: number;
	login: string;
}