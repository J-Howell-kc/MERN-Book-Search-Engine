const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    password: String!
    savedBooks: [Book]
  }

  type Book {
    bookId: ID!
    image: String!
    link: String!
    title: String!
    description: String!
    authors: [String!]
  }

  type Auth {
    token: ID!
    user: User!
  }

  type Query {
    Me: User
  }

  input BookInput {
    bookId: ID!
    image: String!
    link: String!
    title: String!
    description: String!
    authors: [String!]
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(bookData: BookInput!): User
    removeBook(bookId: ID!): User
  }
`;

module.exports = typeDefs;
