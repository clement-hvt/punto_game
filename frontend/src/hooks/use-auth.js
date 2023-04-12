import React, {useState, useContext, createContext} from "react";
import axios from "axios"

axios.defaults.baseURL = 'http://localhost:3000';
const authContext = createContext();

// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export function ProvideAuth({children}) {
    const auth = useProvideAuth();

    if (auth.user === null && localStorage.getItem("token")) {
        auth.signInWithToken(localStorage.getItem("token"))
            .then(() => {
                return <authContext.Provider value={auth}>{children}</authContext.Provider>;
            })
    } else {
        return <authContext.Provider value={auth}>{children}</authContext.Provider>;
    }

}

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuth = () => {
    return useContext(authContext);
};

// Provider hook that creates auth object and handles state
function useProvideAuth() {
    const [user, setUser] = useState(null);
    const [userId, setUserId] = useState(null);

    const signInWithToken = (token) => {
        return new Promise((resolve, reject) => {
            axios.post('/auth/signinWithToken', {token})
                .then(({data}) => {
                    setUser(data.token)
                    setUserId(data.id)
                    localStorage.setItem("token", data.token)
                    resolve()
                })
                .catch(res => localStorage.removeItem("token"))
        })

    };

    const signIn = (email, password) => {
        return axios.post('/auth/signin', {
            email,
            password
        })
            .then(({data}) => {
                setUser(data.token)
                setUserId(data.id)
                localStorage.setItem("token", data.token)
            })
    };

    const signup = dataForSignUp => {
        return axios.post('/users', dataForSignUp)
            .then(({data}) => {
                setUser(data.token)
                setUserId(data.id)
                localStorage.setItem("token", data.token)
            })
    };

    const signOut = () => {
        localStorage.removeItem("token")
        setUser(null)
    }

    // Return the user object and auth methods*/
    return {
        user,
        userId,
        setUser,
        signIn,
        signInWithToken,
        signup,
        signOut
    };
}