import {store} from "../firebase";
import {Collections} from "../utility";
import {nanoid} from "nanoid";


export enum TodoStatus {
    Incomplete = "i",
    Complete = "c"
}

export interface Todo {
    id:string
    userId: string,
    creationTime: number,
    lastUpdated: number,
    complete: TodoStatus
    title: string,
    body?: string,

}

export class Todos {
    static async getTodo(id:string):Promise<Todo|undefined>{
        const todos = store.collection(Collections.Todos);
        try{
            let doc =await todos.doc(id).get();
            return doc.data() as Todo;
        }
        catch (err){
            console.error("Could not get todo",err);
            return undefined
        }
    }
    static async getTodosByTime(userid:null|string,limit = 10, offset?: Todo) {
        let query:FirebaseFirestore.Query = store.collection(Collections.Todos);
        if(userid){
            query = query.where("userId","==",userid);
        }
        query = query.orderBy("creationTime","desc")
        if(offset){
            query = query.startAfter(offset.creationTime);
        }
        query = query.limit(limit);
        let result = await query.get();
        return result.docs.map(doc=>doc.data());
    }


    static async createTodo(data: { userId: string, title: string, body?: string }):Promise<Todo> {
        let todos = store.collection(Collections.Todos);
        let todo: Todo = {
            id:nanoid(),
            creationTime: Date.now(),
            lastUpdated: Date.now(),
            complete: TodoStatus.Incomplete,
            ...data
        }
        await todos.doc(todo.id).set(todo);
        return todo
    }

    static async updateTodo(data: { id: string, title?: string, body?: string, complete?: TodoStatus }) {
        let todos = store.collection(Collections.Todos);
        let id = data.id;
        //@ts-ignore
        delete data.id
        try {
            await todos.doc(id).update({...data, lastUpdated: Date.now()});
        } catch (err) {
            console.error("Error while trying to update todo", err);
            return err
        }
        return true
    }

    static async deleteTodo(id: string) {
        let todos = store.collection(Collections.Todos);
        try {
            await todos.doc(id).delete();
        } catch (err) {
            return err;
        }
        return true;
    }
}

