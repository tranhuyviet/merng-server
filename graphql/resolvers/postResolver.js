const Post = require('../../models/postModel');

module.exports = {
    Query: {
        getPosts: async () => {
            try {
                const posts = await Post.find();

                if (!posts) {
                    throw new Error('Can not get posts');
                }

                return posts;
            } catch (error) {
                throw new Error('Something went wrong when trying to get posts ', error);
            }
        },
    },
};
