export default async () => {
    window.app = {
        user: {
            id: -1,
            name: '',
            username: '',
            token: '',
            role: '',
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

        views: {
            home: {
                timelines: {
                    global: {
                        posts: new Array()
                    },
                    following: {
                        posts: new Array()
                    }
                }
            },

            member: {
                members: new Array()
            }
        }
    }

    const credentials = JSON.parse(localStorage.getItem('user'));

    if (!credentials || !credentials.id || !credentials.token) {
        localStorage.removeItem('user');
        return false;
    };

    const request = await fetch ('/user/auth', {
        method: 'POST',
        headers: { 
            "Authorization": `Bearer ${credentials.token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ user: credentials })
    });

    const response = await request.json();

    if (!response.ok) {
        localStorage.removeItem('user');
        return false;
    };

    window.app.user = response.user;
    return true;
};