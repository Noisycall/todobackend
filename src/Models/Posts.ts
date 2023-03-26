import {store} from "../firebase";
import {Collections} from "../utility";
import {nanoid} from "nanoid";

export interface Comment {
    id: string,
    creationTime: number,
    text: string
}

export interface Post {
    id: string
    userId: string
    title: string
    body: string
    creationTime: number,
    lastUpdated: number,
    comments: Array<Comment>
}

export class Posts {
    static async createPost(data: { userId: string, title: string, body: string }): Promise<Post> {
        let posts_col = store.collection(Collections.Posts);
        let post: Post = {
            id: nanoid(),
            creationTime: Date.now(),
            lastUpdated: Date.now(),
            comments: [],
            ...data
        }
        await posts_col.doc(post.id).set(post);
        return post
    }

    static async deletePost(id: string) {
        let posts_col = store.collection(Collections.Posts);
        try {
            await posts_col.doc(id).delete();
            return true;
        } catch (err) {
            console.error("Could not delete");
            return false
        }
    }

    static async updatePost(data: Post) {
        let posts_col = store.collection(Collections.Posts);
        try {
            await posts_col.doc(data.id).update(data as any);
            return true;
        } catch (err) {
            console.error("Error updating post", err)
            return false;
        }
    }

    static async addCommentToPost(postId: string, comment: Comment) {
        let posts_col = store.collection(Collections.Posts)
        let post = posts_col.doc(postId);
        try {
            await post.update({
                comments: FirebaseFirestore.FieldValue.arrayUnion(comment)
            })
            return true;
        } catch (err) {
            console.error("Error while adding comment", err);
            return false;
        }
    }

    static async getPostsByTime(userid: null | string, limit = 10, offset?: Post) {
        let query: FirebaseFirestore.Query = store.collection(Collections.Posts);
        if (userid) {
            query = query.where("userId", "==", userid);
        }
        query = query.orderBy("creationTime", "desc")
        if (offset) {
            query = query.startAfter(offset.creationTime);
        }
        query = query.limit(limit);
        let result = await query.get();
        return result.docs.map(doc => doc.data());

    }
    static async getPost(id:string):Promise<Post|undefined>{
        const posts = store.collection(Collections.Posts);
        try{
            let doc =await posts.doc(id).get();
            return doc.data() as Post;
        }
        catch (err){
            console.error("Could not get todo",err);

        }
    }
}
