export interface JWTUser {
	id: string;
	email: string | null;
}
export interface GraphqlContext {
	user?: JWTUser;
}
