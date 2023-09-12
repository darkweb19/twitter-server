import { prismaClient } from "../clients/db";

class TweetService {
	public static getAllTweets() {
		return prismaClient.tweet.findMany({ orderBy: { createdAt: "desc" } });
	}
}

export default TweetService;
