//Usage of a static class to logically group all User related methods
import {store} from "../firebase";
import {Collections} from "../utility";
import {nanoid} from "nanoid";

interface User {
    id:string,
    username:string,
    admin:boolean
}
class Users{
    static async getUsers(userNames:Array<string>):Promise<Array<User>>{
        let user_arr:Array<User> = [];
        let users = await store.collection(Collections.Users).where("username","in",userNames).get();
        users.docs.forEach(user=>{
            user_arr.push(user.data() as User);
        })
        return user_arr
    }
    static async createUser(username:string,admin:boolean):Promise<User>{
        let id = nanoid()
        let exist_user = (await Users.getUsers([username]))
        if (exist_user.length){
            console.info("User already exists")
            return exist_user[0]
        }

        let new_user: User ={
            id:id,
            username:username,
            admin:admin
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
console.info(Users.createUser("wow",false));
console.info(Users.getUsers(["wow"]));
