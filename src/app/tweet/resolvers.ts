import { Tweet } from "@prisma/client";
import { prismaClient } from "../../clients/db";
import { GraphqlContext } from "../../interfaces";
import UserService from "../../services/user";
import TweetService from "../../services/tweet";

interface CreateTweetPayload {
	content: string;
	imageUrl?: string;
}

const queries = {
	getAllTweets: () => TweetService.getAllTweets(),
};

const mutations = {
	createTweet: async (
		parent: any,
		{ payload }: { payload: CreateTweetPayload },
		ctx: GraphqlContext
	) => {
		if (!ctx.user?.id) throw new Error("You are not authenticated");
		try {
			const tweet = await prismaClient.tweet.create({
				data: {
					content: payload.content,
					imageUrl: payload.imageUrl,
					author: { connect: { id: ctx.user?.id } },
				},
			});
			return tweet;
		} catch (err: any) {
			console.log(err.message);
		}
	},
};

const extraResolvers = {
	Tweet: {
		author: (parent: Tweet) => UserService.getUserById(parent.authorId),
	},
};

export const resolvers = { mutations, extraResolvers, queries };
