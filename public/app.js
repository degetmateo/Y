export const app = {
    user: {
        id: -1,
        name: '',
        username: '',
        token: '',
        profilePic: {
            url: '',
            crop: {
                x: -1,
                y: -1,
                w: -1,
                h: -1
            }
        }
    },

    users: [],

    posts: {
        home: {
            follow: [],
            global: []
        },
        user: []
    }
}