import JWT from "jsonwebtoken";
import { User } from "@prisma/client";
const JWT_secret = "*Secret@1234";

class JWTService {
	public static generateTokenForUser(user: User) {
		const payload = {
			id: user?.id,
			email: user?.email,
		};
		const token = JWT.sign(payload, JWT_secret);
		return token;
	}
}

export default JWTService;
