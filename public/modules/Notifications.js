export default class Notifications {
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