import passport from "passport";
import jwt from "jsonwebtoken"
import express from "express";
import {User} from "../Models/Users";
export const router = express.Router();

router.post(
    '/signup',
    passport.authenticate('signup', { session: false }),
    async (req, res, next) => {
        res.json({
            message: 'Signup successful',
            user: req.user
        });
    }
);


router.post(
    '/login',
    async (req, res, next) => {
        passport.authenticate(
            'login',
            async (err:any, user:User, info:any) => {
                try {
                    if (err || !user) {
                        const error = new Error('An error occurred.');

                        return next(error);
                    }

                    req.login(
                        user,
                        { session: false },
                        async (error) => {
                            if (error) return next(error);

                            const body = { id: user.id, username: user.username, admin:user.admin };
                            const token = jwt.sign({ user: body }, 'TOP_SECRET');

                            return res.json({ token });
                        }
                    );
                } catch (error) {
                    return next(error);
                }
            }
        )(req, res, next);
    }
);
