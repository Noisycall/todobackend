import {Todo, Todos} from "../src/Models/Todos";

it("Creates, queries and deletes Todos", async () => {
    let created_todo= await Todos.createTodo({userId: "CCfZj8Dj5xUzDsX0nHv1D", body: "wow", title: "wow"});
    let todo = await Todos.getTodo(created_todo.id) as Todo;
    console.info(JSON.stringify(todo))
    let expected = {
        "complete": "i",
        "body": "wow",
        "title": "wow",
        "userId": "CCfZj8Dj5xUzDsX0nHv1D"
    }
    expect(todo).toHaveProperty("id");
    expect(todo).toHaveProperty("creationTime");
    expect(todo).toHaveProperty("lastUpdated");
    expect(todo.title).toEqual(expected.title);
    expect(todo.body).toEqual(expected.body);
    expect(todo.complete).toEqual(expected.complete);
    expect(todo.userId).toEqual(expected.userId);
    await Todos.deleteTodo(todo.id);

    expect(await Todos.getTodo(todo.id)).toBeFalsy();
})
