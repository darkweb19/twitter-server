export const types = `#graphql
    type User{
        id : ID!
        firstname : String!
        lastname : String!
        email : String!
        profileImageUrl : String
        followers :[User]
        following : [User]
        tweets : [Tweet]
}

`;
