const express = require("express");
// import apolloServer
const { ApolloServer } = require("apollo-server-express");

// import our tyedefs and resolvers
const { typeDefs, resolvers } = require("./schemas");
const db = require("./config/connection");

const PORT = process.env.PORT || 3001;
// create a new Apollo server and pass in our schema data
const server = new ApolloServer({
  typeDefs,
  resolvers,
});
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// create a new instance of an apollo server with graphqlschema
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  // integrage our apollo server with the exporess applicatoin as middlware
  server.applyMiddleware({ app });

  db.once("open", () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      // log where we can go to test our gql api
      console.log(
        `Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`
      );
    });
  });
};

// call the async function to start the server
startApolloServer(typeDefs, resolvers);
