import React, { createContext, useContext, ReactNode } from "react";
import { useAppwrite } from "./useAppwrite";
import { getCurrentUser } from "./appwrite";

// Typing the user
interface User {
    $id: string;
    name: string;
    email: string;
    avatar: string;  // Fixed the typo here
}

// GlobalContext type
interface GlobalContextType {
    isLoggedIn: boolean;
    user: User | null;
    loading: boolean;
    refetch: (newParams?: Record<string, string | number>) => Promise<void>;
}

// Creating the context
const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

// GlobalProvider component
export const GlobalProvider = ({ children }: { children: ReactNode }) => {
    const {
        data: user,
        loading,
        refetch
    } = useAppwrite({
        fn: getCurrentUser,
    });

    const isLoggedIn = !!user;

    console.log(JSON.stringify(user, null, 2));

    return (
        <GlobalContext.Provider value={{
            isLoggedIn,
            user,
            loading,
            refetch
        }}>
            {children}
        </GlobalContext.Provider>
    );
};

// Custom hook to use the global context
export const useGlobalContext = (): GlobalContextType => {
    const context = useContext(GlobalContext);

    if (!context) {
        throw new Error('useGlobalContext must be used within a GlobalProvider');
    }

    return context;
};

export default GlobalProvider;
