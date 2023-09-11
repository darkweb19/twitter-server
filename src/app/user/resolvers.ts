import axios from "axios";
import { prismaClient } from "../../clients/db";
import JWTService from "../../services/jwt";
import { GraphqlContext } from "../../interfaces";
import { User } from "@prisma/client";

interface GoogleTokenResults {
	iss?: string;
	nbf?: string;
	aud?: string;
	sub?: string;
	email?: string;
	email_verified?: string;
	azp?: string;
	name?: string;
	picture?: string;
	given_name?: string;
	family_name?: string;
	iat?: string;
	exp?: string;
	jti?: string;
	alg?: string;
	kid?: string;
	typ?: string;
}

const queries = {
	verifyGoogleToken: async (parent: any, { token }: { token: string }) => {
		const googleToken = token;
		const googleOauthUrl = new URL(
			"https://oauth2.googleapis.com/tokeninfo"
		);
		googleOauthUrl.searchParams.set("id_token", googleToken);

		const { data } = await axios.get<GoogleTokenResults>(
			googleOauthUrl.toString(),
			{
				responseType: "json",
			}
		);
		console.log(data);

		const user = await prismaClient.user.findUnique({
			where: {
				email: data.email,
			},
		});

		if (!user) {
			await prismaClient.user.create({
				data: {
					email: data.email,
					firstname: data.given_name,
					lastname: data.family_name,
					profileImageUrl: data.picture,
				},
			});
		}
		const userInDb = await prismaClient.user.findUnique({
			where: { email: data?.email },
		});
		if (!userInDb) {
			throw new Error("User not found in database");
		}

		const userToken = JWTService.generateTokenForUser(userInDb);

		return userToken;
	},
	getCurrentUser: async (parent: any, args: any, ctx: GraphqlContext) => {
		console.log(ctx);
		const id = ctx.user?.id;
		if (!id) return null;
		const user = await prismaClient.user.findUnique({ where: { id } });
		return user;
	},
	getUserById: async (
		parent: any,
		{ id }: { id: any },
		ctx: GraphqlContext
	) => prismaClient.user.findUnique({ where: { id } }),
};

const extraResolvers = {
	User: {
		tweets: (parent: User) =>
			prismaClient.tweet.findMany({ where: { authorId: parent.id } }),
	},
};

export const resolvers = { queries, extraResolvers };
