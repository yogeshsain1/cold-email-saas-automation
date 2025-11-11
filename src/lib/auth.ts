import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { bearer } from "better-auth/plugins";
import { NextRequest } from 'next/server';
import { headers } from "next/headers"
import { db } from "@/db";
 
const authConfig: any = {
	database: drizzleAdapter(db, {
		provider: "sqlite",
	}),
	emailAndPassword: {    
		enabled: true
	},
	plugins: [bearer()]
};

// Only add Google OAuth if credentials are provided
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
	authConfig.socialProviders = {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		},
	};
}

export const auth = betterAuth(authConfig);

// Session validation helper
export async function getCurrentUser(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user || null;
}