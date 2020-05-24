const postResolver = require('./postResolver');
const userResolver = require('./userResolver');
const commentResolver = require('./commentResolver');

module.exports = {
    Query: {
        ...postResolver.Query,
    },
    Mutation: {
        ...postResolver.Mutation,
        ...userResolver.Mutation,
        ...commentResolver.Mutation,
    },
};
