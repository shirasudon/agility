
export const login = (user) => {
    const response = {
        token: '82jf3td9h',
        data: {
            email: user.email,
            firstName: 'nobi',
            lastName: 'nobita'
        }
    }
    return new Promise(resolve => setTimeout(resolve(response), 1));
};

export const logout = () => {
    return new Promise(resolve => setTimeout(resolve, 1));
}
