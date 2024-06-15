import React, { useState} from 'react';
import { Hub } from 'aws-amplify';
// import { AuthProvider } from './components/AuthProvider';
//import { useAuth } from './components/AuthProvider';
/* setIsUserAuthenticated(true);
        const { setIsUserAuthenticated } = useAuth();
        */

const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
    const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);

    const listener = (data) => {
        switch (data?.payload?.event) {
        case 'signIn':
            console.log('user signed in');
            setIsUserAuthenticated(true);
            break;
        case 'signIn_failure':
            console.log('user sign in failed');
            setIsUserAuthenticated(false);
            break;
        case 'signUp':
            console.log('user signed up');
            break;
        case 'signUp_failure':
            console.log('user sign up failed');
            setIsUserAuthenticated(false);
            break;
        case 'signOut':
            console.log('user signed out');
            setIsUserAuthenticated(false);
            break;
        default:
            console.log('unknown: ', data.payload.event);
            break;
        }
    };
    Hub.listen('auth', listener);

    return (
    <AuthContext.Provider value={{ isUserAuthenticated, setIsUserAuthenticated}}>
        {children}
    </AuthContext.Provider>
    );
};

export const useAuth = () => React.useContext(AuthContext);