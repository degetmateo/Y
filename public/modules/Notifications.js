export default class Notifications {
    static RequestPermissions () {
        // if ('serviceWorker' in navigator) {
        //     navigator.serviceWorker.register('./service-worker.js')
        //         .then(r => {
        //             console.log('Service Worker registered.', r);
        //         })
        //         .catch(err => {
        //             console.error('Error. Service Worker denied.', err);
        //         });
        // }

        Notification.requestPermission()
            .then(per => {
                if (per === 'granted') {
                    console.log('Permissions were granted.');
                }
            });
    }

    static async Fetch () {
        const request = await fetch('/api/notifications/'+0, {
            method: "GET",
            headers: { "Authorization": "Bearer "+window.app.user.token }
        });
        const response = await request.json();
        if (!response.ok) throw new Error(response.error.message);
        return response.notifications;
    }

    static SaveLast (_id) {
        localStorage.setItem('notifications', JSON.stringify({ last_id: _id }));
    }
}