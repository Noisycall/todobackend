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
securedRoutes.post("/posts",async (req, res) => {
    console.info(req.body)
    if(!(req.body.hasOwnProperty("title")&&req.body.hasOwnProperty("body"))){
        res.status(400).json({message:"Missing neccessary field title or body"})
        return;
    }
    let user = req.user as User
    console.info(user)
    let post = {
        title:req.body.title,
        body:req.body.body,
        userId:user.id
    }
    let returned = await Posts.createPost(post);
    res.json(returned);
})
