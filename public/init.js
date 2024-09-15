export default () => {
    window.app = {
        alerts: new Array(),

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

    if (!localStorage.getItem('notifications')) {
        localStorage.setItem('notifications', JSON.stringify({ last_id: 0 }));
    }
    // Notifications.RequestPermissions();
}