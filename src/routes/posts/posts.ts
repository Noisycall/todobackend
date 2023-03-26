import {Posts} from "../../Models/Posts";
import {User} from "../../Models/Users";
import {securedRoutes} from "../routers";

securedRoutes.get("/posts", async (req, res) => {
    let limit = 10;
    let offset = null;
    let userId = null;
    console.info(req.body)
    if (req.body.hasOwnProperty("limit"))
        limit = req.body.limit;
    if (req.body.hasOwnProperty("offset"))
        offset = req.body.offset
    if (req.body.hasOwnProperty("userId"))
        userId = req.body.userId
    let posts = await Posts.getPostsByTime(userId, limit, offset);
    res.json({posts: posts});

})
securedRoutes.post("/posts", async (req, res) => {
    console.info(req.body)
    if (!(req.body.hasOwnProperty("title") && req.body.hasOwnProperty("body"))) {
        res.status(400).json({message: "Missing neccessary field title or body"})
        return;
    }
    let user = req.user as User
    console.info(user)
    let post = {
        title: req.body.title,
        body: req.body.body,
        userId: user.id
    }
    let returned = await Posts.createPost(post);
    res.json(returned);
})
securedRoutes.get("/post/:id", async (req, res) => {
    try {
        let post = await Posts.getPost(req.params.id);
        res.json(post);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Unknown Error"});
    }
})

securedRoutes.post("/posts/comment", async (req, res) => {
    try {
        if (!req.body.id) {
            res.status(400).json({message: "Invalid Post ID"})
            return;
        }

        let user = req.user as User;
        if (!req.body.text) {
            res.status(400).json({message: "No comment text"})
            return;
        }


        let comment = {
            userId: user.id,
            text: req.body.text
        }
        let returned = await Posts.addCommentToPost(req.body.id, comment);
        res.json(returned);

    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Unknown Error"})
    }
})
