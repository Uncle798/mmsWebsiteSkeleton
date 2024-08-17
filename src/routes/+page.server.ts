import type { Actions, PageServerLoad } from './$types'
import prisma  from '$lib/server/prisma'
import { error, fail, redirect } from '@sveltejs/kit'

export const load:PageServerLoad = async ({ locals }) =>{
   const { user } =  locals;
   return { user };
}