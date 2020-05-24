const Post = require('../../models/postModel');
const { AuthenticationError } = require('apollo-server');
const checkAuth = require('../../utils/checkAuth');

module.exports = {
    Query: {
        // GET ALL POST
        getPosts: async () => {
            try {
                const posts = await Post.find().sort({ createdAt: -1 });

                if (!posts) {
                    throw new Error('Can not get posts');
                }

                return posts;
            } catch (error) {
                // throw new UserInputError('GET ALL POSTS ERROR ', error);
                throw new Error('GET ALL POSTS ERROR ', error);
            }
        },

        // GET POST BY ID
        getPost: async (_, { postId }) => {
            try {
                const post = await Post.findById(postId);

                if (!post) {
                    // throw new UserInputError('Could not found post provided by Id');
                    throw new Error('Post not found');
                }

                return post;
            } catch (error) {
                // throw new UserInputError('GET POST ERROR ', error);
                throw new Error(error);
            }
        },
    },

    Mutation: {
        // CREATE NEW POST
        createPost: async (_, { body }, context) => {
            try {
                const user = checkAuth(context);

                if (!user) {
                    throw new AuthenticationError('Not authenticated');
                }

                const newPost = new Post({
                    body,
                    username: user.username,
                    user: user.id,
                    createdAt: new Date().toISOString(),
                });

                const post = await newPost.save();

                context.pubsub.publish('NEW_POST', {
                    newPost: post,
                });

                return post;
            } catch (error) {
                throw new Error(error);
            }
        },

        // DELETE POST
        deletePost: async (_, { postId }, context) => {
            try {
                const user = checkAuth(context);

                if (!user) {
                    throw new AuthenticationError('Not authenticated');
                }

                const post = await Post.findById(postId);

                if (!post) {
                    throw new Error('Can not found post');
                }

                if (post.username === user.username) {
                    await post.delete();
                    return 'Post deleted successfully';
                } else {
                    throw new AuthenticationError('Action not allowed');
                }
            } catch (error) {
                throw new Error(error);
            }
        },

        // TOGGLE LIKE POST
        likePost: async (_, { postId }, context) => {
            try {
                const user = checkAuth(context);

                if (!user) {
                    throw new AuthenticationError('Not authenticated');
                }

                const post = await Post.findById(postId);

                if (!post) {
                    throw new UserInputError('Can not found post');
                }

                const isLike = post.likes.find((like) => like.username === user.username);

                // if like already, -> unlike it
                if (isLike) {
                    post.likes = post.likes.filter((like) => like.username !== user.username);
                } else {
                    // if not like -> like it
                    post.likes.unshift({
                        username: user.username,
                        createdAt: new Date().toISOString(),
                    });
                }

                await post.save();

                return post;
            } catch (error) {
                throw new Error(error);
            }
        },
    },

    Subscription: {
        newPost: {
            subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('NEW_POST'),
        },
    },
};
