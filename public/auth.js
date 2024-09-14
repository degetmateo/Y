export default async () => {
    try {
        const credentials = JSON.parse(localStorage.getItem('user'));
        localStorage.removeItem('user');
        if (!credentials || !credentials.id || !credentials.username || !credentials.token) return false;
        const request = await fetch ('/api/member/auth', {
            method: 'POST',
            headers: { 
                "Authorization": `Bearer ${credentials.token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ user: credentials })
        });
    
        const response = await request.json();
    
        localStorage.setItem('user', JSON.stringify({ id: response.user.id, username: response.user.username, token: response.user.token }));
        window.app.user = response.user;
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
};