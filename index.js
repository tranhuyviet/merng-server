require('dotenv').config();
const { ApolloServer, PubSub } = require('apollo-server');
const mongoose = require('mongoose');

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

// pubsub for subcription
const pubsub = new PubSub();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req, pubsub }),
});

// Server
(async () => {
    try {
        await mongoose.connect(process.env.MONGODB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Database connect successfully');
        const serverRes = await server.listen({ port: process.env.PORT || 5000 });
        console.log(`Server running at ${serverRes.url}`);
    } catch (error) {
        console.error(error);
        throw new Error('Server failed');
    }
})();
