import GetPost from "../PostController";

describe('Post Controller Dummy Test', () => {
    it("should return a static value", () => {
        var post = GetPost();
        expect(post.id).toBe(1);
        expect(post.title).toBe("");
        expect(post.body).toBe("");

        // Same thing as the above
        expect(Object.is(post, {
            id: 1,
            title: "",
            body: ""
        }));
    })
});