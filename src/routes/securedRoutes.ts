import express from "express"
import {Posts} from "../Models/Posts";
import {User} from "../Models/Users";
import {Todos} from "../Models/Todos";

export const securedRoutes = express.Router();

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

securedRoutes.get("/todos",async (req,res)=>{
    let limit = 10;
    let offset = null;
    let userId = null;
    console.info(req.body)
    if (req.body.limit)
        limit = req.body.limit;
    if (req.body.hasOwnProperty("offset")){
        offset = req.body.offset}
    if (req.body.hasOwnProperty("userId"))
        userId = req.body.userId
    let todos = await Todos.getTodosByTime(userId, limit, offset);
    res.json({todos: todos});
})

securedRoutes.post("/todos",async (req, res) => {
    if(!(req.body.hasOwnProperty("title"))){
        res.status(400).json({message:"Missing neccessary field title"})
        return;
    }
    let user = req.user as User
    console.info(user)
    let todo = {
        title:req.body.title,
        body:req.body.body??"",
        userId:user.id
    }
    let returned = await Todos.createTodo(todo);
    res.json(returned);
})
securedRoutes.patch("/todos",async (req, res)=>{
    let user = req.user as User
    if(!req.body.id){
        res.status(400).json({message:"No id specified"})
        return;
    }
    let doc = await Todos.getTodo(req.body.id);
    if(doc){
        if(doc.userId!==user.id&&!user.admin){
            res.status(403).json({message:"You cannot edit this todo"});
            return;
        }
    }
    else {
        res.status(400).json({message:"Todo does not exist"})
        return;
    }
    let todo:any = {id:req.body.id};
    if(req.body.hasOwnProperty("title"))
        todo.title = req.body.title
    if(req.body.hasOwnProperty("complete"))
        todo.complete = req.body.complete
    if(req.body.hasOwnProperty("body"))
        todo.body =req.body.body
    let returned = await Todos.updateTodo(todo);
    if(returned){
        res.json(await Todos.getTodo(req.body.id));
        return;
    }
    res.status(500).json({message:"Unknown Error"})

})
