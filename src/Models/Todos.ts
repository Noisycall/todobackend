import {store} from "../firebase";
import {Collections} from "../utility";


export enum TodoStatus {
    Incomplete = "i",
    Complete = "c"
}

export interface Todo {
    userId: string,
    creationTime: number,
    lastUpdated: number,
    complete: TodoStatus
    title: string,
    body?: string,

}

export class Todos {
    static async getTodosByTime(limit = 10, offset?: Todo) {
        let todos_col = store.collection(Collections.Todos);
        let todos: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> = todos_col;
        if (offset) {
            todos = todos.startAfter(offset);
        }
        todos = todos.orderBy("creationTime", "desc").limit(limit);
        let todo_arr = (await todos.get()).docs.map(doc => doc.data());
        return todo_arr;
    }

    static async getTodosForUser(id: string, limit = 10, offset?: Todo) {
        let todos_col = store.collection(Collections.Todos).where("userId", "==", id);
        let todos = Todos.getTimeOrderedTodos(todos_col);
        let todo_arr = (await todos.get()).docs.map(doc => doc.data());
    }

    private static getTimeOrderedTodos(prev_query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData>, limit = 10, offset?: Todo) {
        let todos: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> = prev_query;
        if (offset) {
            todos = todos.startAfter(offset);
        }
        return todos.orderBy("creationTime", "desc").limit(limit);
    }

    static async createTodo(data: { userId: string, title: string, body?: string }) {
        let todos = store.collection(Collections.Todos);
        let todo: Todo = {
            creationTime: Date.now(),
            lastUpdated: Date.now(),
            complete: TodoStatus.Incomplete,
            ...data
        }
        let val = await todos.add(todo);
        return val.id
    }

    static async updateTodo(data: { id: string, title?: string, body?: string, complete?: TodoStatus }) {
        let todos = store.collection(Collections.Todos);
        let id = data.id;
        //@ts-ignore
        delete data.id
        try {
            let val = await todos.doc(id).update({...data, lastUpdated: Date.now()});
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

let main = async () => {
    let todo =await Todos.createTodo({userId: "CCfZj8Dj5xUzDsX0nHv1D", body: "wow", title: "wow"});
    let todos = await Todos.getTodosByTime();
    console.info(JSON.stringify(todos))
    await Todos.deleteTodo(todo);
    todos = await Todos.getTodosByTime();
    console.info(JSON.stringify(todos));


}
main()
