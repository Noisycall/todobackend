import passport from "passport";
import jwt from "jsonwebtoken"
import express from "express";
import {User, UserErrors} from "../Models/Users";
export const router = express.Router();

router.post(
    '/signup',
    passport.authenticate('signup', { session: false }),
    async (req, res, next) => {
        let user = req.user as User
        if(user.id===UserErrors.AlreadyExist){
            res.status(400).json({message:"User already exists"})
            return;
        }
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
            async (err:any, user:Array<User>, info:any) => {
                try {
                    console.info(user);
                    if (err || !user) {
                        const error = new Error('An error occurred.');

                        return next(error);
                    }

                    req.login(
                        user[0],
                        { session: false },
                        async (error) => {
                            if (error) return next(error);
                            const body = { id: user[0].id, username: user[0].username, admin:user[0].admin };
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
