const Post = require('../../models/postModel');
const checkAuth = require('../../utils/checkAuth');
const { UserInputError, AuthenticationError } = require('apollo-server');

module.exports = {
    Mutation: {
        // CREATE NEW COMMENT
        createComment: async (_, { postId, body }, context) => {
            try {
                const user = checkAuth(context);

                if (!user) {
                    throw new AuthenticationError('Not authenticated');
                }

                if (body.trim() === '') {
                    throw new UserInputError('Empty comment', {
                        errors: {
                            body: 'Comment body must not empty',
                        },
                    });
                }

                const post = await Post.findById(postId);

                if (!post) {
                    throw new UserInputError('Post not found');
                }

                post.comments.unshift({
                    body,
                    username: user.username,
                    createdAt: new Date().toISOString(),
                });

                await post.save();

                return post;
            } catch (error) {
                throw new Error(error);
            }
        },

        // DELETE COMMENT
        deleteComment: async (_, { postId, commentId }, context) => {
            try {
                const user = checkAuth(context);

                if (!user) {
                    throw new AuthenticationError('Not authenticated');
                }

                const post = await Post.findById(postId);

                if (!post) {
                    throw new UserInputError('Post not found');
                }

                const commentIndex = post.comments.findIndex((comment) => {
                    // console.log(comment.id, commentId);
                    return comment.id === commentId;
                });

                if (post.comments[commentIndex].username !== user.username) {
                    throw new AuthenticationError('Action not allowed');
                }

                post.comments.splice(commentIndex, 1);
                await post.save();
                return post;
            } catch (error) {
                throw new Error(error);
            }
        },
    },
};
