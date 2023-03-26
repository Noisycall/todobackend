
import {Posts,Post} from "../src/Models/Posts";

it("Creates, queries and deletes posts", async () => {
    let post_created = await Posts.createPost({userId: "CCfZj8Dj5xUzDsX0nHv1D", body: "wow", title: "wow"});
    let post_got = await Posts.getPost(post_created.id) as Post;
    console.info(JSON.stringify(post_got))
    let expected = {
        "complete": "i",
        "body": "wow",
        "title": "wow",
        "userId": "CCfZj8Dj5xUzDsX0nHv1D"
    }
    expect(post_got).toHaveProperty("id");
    expect(post_got).toHaveProperty("creationTime");
    expect(post_got).toHaveProperty("lastUpdated");
    expect(post_got.title).toEqual(expected.title);
    expect(post_got.body).toEqual(expected.body);
    expect(post_got.comments).toEqual([]);
    expect(post_got.userId).toEqual(expected.userId);
    await Posts.deletePost(post_created.id);
    expect(await Posts.getPost(post_created.id)).toBeFalsy();
})
