import {store} from "../firebase";
import {Collections} from "../utility";
import {firestore} from "firebase-admin";
import Firestore = firestore.Firestore;

export enum TodoStatus{
    Incomplete="incomplete",
    Complete="complete"
}
export interface Todo {
    userId:string,
    creationTime:string,
    lastUpdated:string,
    complete:TodoStatus

}
export class Todos{
   async getTodosByTime(limit=10,offset?:Todo){
       let todos_col = store.collection(Collections.Todos);
       let todos: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> =todos_col;
       if(offset){
           todos = todos.startAfter(offset);
       }
       todos= todos.orderBy("creationTime","desc").limit(limit);
       let todo_arr = (await todos.get()).docs.map(doc=>doc.data());
    }
    async getTodosForUser(id:string,limit=10,offset?:Todo){
        let todos_col = store.collection(Collections.Todos).where("userId","==",id);
        let todos: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> =todos_col;
        if(offset){
            todos = todos.startAfter(offset);
        }
        todos= todos.orderBy("creationTime","desc").limit(limit);
        let todo_arr = (await todos.get()).docs.map(doc=>doc.data());
    }
    async createTodo(data:Todo){

    }

}
