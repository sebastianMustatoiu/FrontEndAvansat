import React, { ReactNode } from 'react';
import { taskStore, authStore } from './index';

interface StoreProviderProps {
    children: ReactNode;
}

const StoreContext = React.createContext({ taskStore, authStore });

export const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
    return (
        <StoreContext.Provider value={{ taskStore, authStore }}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStore = () => React.useContext(StoreContext);
