import {Todos} from "../src/Models/Todos";

let main = async () => {
    let todo =await Todos.createTodo({userId: "CCfZj8Dj5xUzDsX0nHv1D", body: "wow", title: "wow"});
    let todos = await Todos.getTodosByTime(null);
    console.info(JSON.stringify(todos))
    await Todos.deleteTodo(todo.id);
    todos = await Todos.getTodosByTime(null);
    console.info(JSON.stringify(todos));
}
main()
