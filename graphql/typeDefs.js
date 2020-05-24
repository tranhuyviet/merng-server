const { gql } = require('apollo-server');

const typeDefs = gql`
    type Post {
        id: ID!
        body: String!
        username: String!
        createdAt: String!
    }

    type User {
        id: ID!
        email: String!
        username: String!
        token: String!
        createdAt: String!
    }

    input RegisterInput {
        username: String!
        password: String!
        confirmPassword: String!
        email: String!
    }

    type Query {
        getPosts: [Post]
        getPost(postId: ID!): Post!
    }

    type Mutation {
        register(registerInput: RegisterInput): User!
        login(username: String!, password: String!): User!
        createPost(body: String!): Post!
        deletePost(postId: String!): String!
    }
`;

module.exports = typeDefs;
