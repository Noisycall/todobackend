//Usage of a static class to logically group all User related methods
import {store} from "../firebase";
import {Collections} from "../utility";
import {nanoid} from "nanoid";

export interface User {
    id:string,
    username:string,
    admin:boolean,
    password:string
}
export class Users{
    static async getUsers(userNames:Array<string>):Promise<Array<User>>{
        let user_arr:Array<User> = [];
        let users = await store.collection(Collections.Users).where("username","in",userNames).get();
        users.docs.forEach(user=>{
            user_arr.push(user.data() as User);
        })
        return user_arr
    }
    static async setAdmin(id:string,admin:boolean){

    }
    static async createUser(username:string,password:string):Promise<User>{
        let id = nanoid()
        let exist_user = (await Users.getUsers([username]))
        if (exist_user.length){
            console.info("User already exists")
            throw new Error("User already exists");
        }

        let new_user:User ={
            id:id,
            username:username,
            admin:false,
            password:password
        }
        try {
            await store.collection(Collections.Users).doc(new_user.id).set(new_user);
        }
        catch (err){
            console.error("Error Creating Firestore User",err);
        }
        return new_user
    }
}
// console.info(Users.createUser("wow","none"));
// console.info(Users.getUsers(["wow"]));
