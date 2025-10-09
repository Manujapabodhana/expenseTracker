import React, { useEffect } from 'react';

export const UserContext = React.createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = React.useState(null);

    // Initialize user from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        
        if (storedUser && storedToken) {
            try {
                const userData = JSON.parse(storedUser);
                setUser(userData);
            } catch (error) {
                console.error('Error parsing stored user data:', error);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }
    }, []);

    //function to update user data
    const updateUser = (userData) => {
        setUser(userData);
    };

    //function to clear user data on logout
    const clearUser = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    return (
        <UserContext.Provider
            value={{
                user,
                updateUser,
                clearUser,
            }}
            >
            {children}
        </UserContext.Provider>
    );
}

export default UserProvider;
    