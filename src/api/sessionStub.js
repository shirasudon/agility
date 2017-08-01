
export default class SessionApiStub {
    static login(user){
        const users = [
            {username: "john", password: "pass", firstName: "john", lastName: "perry"},
            {username: "kary", password: "hey", firstName: "kary", lastName: "huston"},
        ];

        const match = users.find(u => u.username === user.username && u.password === user.password);
        let response;
        if (match === undefined) {
            response = {
                ok: false,
            }
        }
        else {
            response = {
                ok: true,
                token: '82jf3td9h',
                data: {
                    email: user.username,
                    firstName: match.firstName,
                    lastName: match.lastName,
                }
            }
        }
        return new Promise(resolve => setTimeout(() => {
            resolve(response)
        }, 1000));
    }

    static logout(){
        return new Promise(resolve => setTimeout(resolve, 1000));
    }
}