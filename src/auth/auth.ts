import passport from "passport";
import passport_jwt from "passport-jwt"
import passport_local from "passport-local"
import bcrypt from "bcrypt"
import {Users} from "../Models/Users";

const localStrategy = passport_local.Strategy;
const JWTstrategy = passport_jwt.Strategy
const ExtractJWT = passport_jwt.ExtractJwt

passport.use(
    new JWTstrategy(
        {
            secretOrKey: 'TOP_SECRET',
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
        },
        async (token, done) => {
            try {
                return done(null, token.user);
            } catch (error) {
                done(error);
            }
        }
    )
);
passport.use(
    'signup',
    new localStrategy(
        {
            usernameField: 'username',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                const hash = await bcrypt.hash(password, 10);
                const user = await Users.createUser(email,hash);
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    )
);
passport.use(
    'login',
    new localStrategy(
        {
            usernameField: 'username',
            passwordField: 'password'
        },
        async (username, password, done) => {
            try {
                const user = await Users.getUsers([username]);

                if (!user.length) {
                    return done(null, false, { message: 'User not found' });
                }

                const validate = await bcrypt.compare(password,user[0].password);

                if (!validate) {
                    return done(null, false, { message: 'Wrong Password' });
                }

                return done(null, user, { message: 'Logged in Successfully' });
            } catch (error) {
                return done(error);
            }
        }
    )
);
