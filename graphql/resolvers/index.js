const postResolver = require('./postResolver');
const userResolver = require('./userResolver');
const commentResolver = require('./commentResolver');

// const checkAuth = require('../../utils/checkAuth');

module.exports = {
    Post: {
        likeCount: (parent) => {
            return parent.likes.length;
        },
        commentCount: (parent) => {
            return parent.comments.length;
        },
        // isLike: (parent, __, context) => {
        //     const user = checkAuth(context);

        //     const checkIsLike = parent.likes.find((like) => like.username === user.username);

        //     if (checkIsLike) {
        //         return true;
        //     } else {
        //         return false;
        //     }
        // },
    },
    Query: {
        ...postResolver.Query,
    },
    Mutation: {
        ...postResolver.Mutation,
        ...userResolver.Mutation,
        ...commentResolver.Mutation,
    },
    Subscription: {
        ...postResolver.Subscription,
    },
};
