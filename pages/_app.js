import "../styles/globals.css";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
  createHttpLink,
} from "@apollo/client";

const client = new ApolloClient({
  ssrMode: true,
  link: createHttpLink({
    uri: "http://localhost:3000//api/graphql",
    credentials: "same-origin",
    // headers: {
    //   cookie: req.header("Cookie"),
    // },
  }),
  cache: new InMemoryCache(),
});

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp;
