const { UserInputError } = require('apollo-server');
const User = require('../../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { validateRegisterInput, validateLoginInput } = require('../../utils/validators');

const signToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            username: user.username,
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

module.exports = {
    Mutation: {
        // REGISTER NEW USER
        register: async (_, args, context, info) => {
            try {
                const { username, password, confirmPassword, email } = args.registerInput;

                // validate user data
                const { errors, valid } = validateRegisterInput(
                    username,
                    email,
                    password,
                    confirmPassword
                );

                if (!valid) {
                    throw new UserInputError('Register Input Error', { errors });
                }

                // check the user is exist
                const existUser = await User.findOne({ username });

                if (existUser) {
                    throw new UserInputError('User already exists', {
                        errors: {
                            username: 'This username is taken',
                        },
                    });
                }
                // hash password and create an auth token
                const hashedPassword = await bcrypt.hash(password, 12);
                const newUser = new User({
                    username,
                    password: hashedPassword,
                    email,
                    createdAt: new Date().toISOString(),
                });

                const user = await newUser.save();

                const token = signToken(user);

                return {
                    ...user._doc,
                    id: user._id,
                    token,
                };
            } catch (error) {
                return error;
                // throw new Error(error);
                //console.error(error);
            }
        },

        // LOGIN
        login: async (_, { username, password }) => {
            try {
                const { errors, valid } = validateLoginInput(username, password);

                if (!valid) {
                    throw new UserInputError('Login Input Error', { errors });
                }

                const user = await User.findOne({ username });

                if (!user) {
                    errors.general = 'User not found';
                    throw new UserInputError('User not found', { errors });
                }

                const match = await bcrypt.compare(password, user.password);
                if (!match) {
                    errors.general = 'Wrong credentials';
                    throw new UserInputError('Wrong credentials', { errors });
                }

                const token = signToken(user);

                return {
                    ...user._doc,
                    id: user._id,
                    token,
                };
            } catch (error) {
                // throw new UserInputError('Login Error ', error);
                return error;
            }
        },
    },
};
