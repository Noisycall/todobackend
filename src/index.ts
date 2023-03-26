import express from "express";
import passport from "passport";
import bodyParser from "body-parser";
import {router as routes, securedRoutes} from "./routes/routers"

require("./auth/auth")
require("./routes/auth/auth_routes")
require("./routes/posts/posts")
require("./routes/todos/todos")
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json())
app.use('/', routes);

// Plug in the JWT strategy as a middleware so only verified users can access this route.
app.use('/secured', passport.authenticate('jwt', { session: false }), securedRoutes);

// Handle errors.
//@ts-ignore
app.use((err, req, res, next) =>  {
    res.status(err.status || 500);
    res.json({ error: err });
});

app.listen(3888, () => {
    console.log('Server started.')
});
