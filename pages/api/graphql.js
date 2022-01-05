import axios from "axios";
// npm i apollo-server-micro@2.25.0 version above 3 has a know bug!!!
import { ApolloServer, gql } from "apollo-server-micro";

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: Person
  }

  type Person {
    name: String
    age: Int
  }

  type GithubUser {
    id: ID
    login: String
    avatar_url: String
  }

  # https://www.apollographql.com/docs/apollo-server/schema/schema/
  type Mutation {
    AddBook(title: String, name: String, age: Int): Book
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
    people: [Person]
    getUsers: [GithubUser]
  }
`;

let books = [
  {
    title: "Witch on the White Night",
    author: {
      name: "Lucas",
      age: 24,
    },
  },
  {
    title: "Cascading Time",
    author: {
      name: "Oliva",
      age: 22,
    },
  },
];

const people = [
  {
    name: "Sophia",
    age: 23,
  },
  {
    name: "James",
    age: 24,
  },
];

//Resolvers define the technique for fetching the types defined in the
//schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    books: () => books,
    people: () => people,
    getUsers: async () => {
      try {
        const users = await axios("https://api.github.com/users");
        return users.data.map(({ id, login, avatar_url }) => ({
          id,
          login,
          avatar_url,
        }));
      } catch (error) {
        throw error;
      }
    },
  },
  Mutation: {
    AddBook: (_, { title, name, age }) => {
      console.log("Reached mutation", title, name, age);
      const newBook = { title, author: { name, age } };
      books = [...books, newBook];
      return newBook;
    },
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
// server.listen().then(({ url }) => {
//   console.log(`🚀  Server ready at ${url}`);
// });

// const cors = Cors();
// const startServer = server.start();

export default server.createHandler({ path: "/api/graphql" });

// Disable the bory parser
export const config = {
  api: {
    bodyParser: false,
  },
};

// Visit https://rickandmortyapi.com/graphql and change the URL in your browser.
