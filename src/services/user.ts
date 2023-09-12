import axios from "axios";
import { prismaClient } from "../clients/db";
import JWTService from "./jwt";

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
class UserService {
	public static async verifyGoogleAuthToken(token: string) {
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
	}

	public static async getUserById(id: string) {
		return prismaClient.user.findUnique({ where: { id } });
	}

	public static followUser(from: string, to: string) {
		return prismaClient.follows.create({
			data: {
				follower: {
					connect: { id: from },
				},
				following: {
					connect: { id: to },
				},
			},
		});
	}

	public static unFollowUser(from: string, to: string) {
		return prismaClient.follows.delete({
			where: {
				followerId_followingId: { followerId: from, followingId: to },
			},
		});
	}
}

export default UserService;
