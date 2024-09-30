// See https://kit.svelte.dev/docs/types#app

import { PrismaClient } from '@prisma/client';

// for information about these interfaces
declare global {
	namespace App {
		interface Error {
			message: string;
		}
		interface Locals {
			user: import('lucia').User | null;
			session: import('lucia').Session | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
	let prisma:PrismaClient
	namespace Lucia{
		type Auth = import('$lib/server/lucia').Auth
		type UserAttributes = {
			email: string
		}
	}
}

export {};
