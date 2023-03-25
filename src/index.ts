import express from "express";
import passport from "passport";
import bodyParser from "body-parser";
require("./auth/auth")
import {router as routes} from "./routes/routes"

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', routes);

// Plug in the JWT strategy as a middleware so only verified users can access this route.
// app.use('/user', passport.authenticate('jwt', { session: false }), secureRoute);

// Handle errors.
//@ts-ignore
app.use((err, req, res, next) =>  {
    res.status(err.status || 500);
    res.json({ error: err });
});

app.listen(3000, () => {
    console.log('Server started.')
});
