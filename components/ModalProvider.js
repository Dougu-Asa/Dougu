import React, { createContext, useState } from 'react';

// Create the context
const ModalContext = React.createContext();

// Create a provider component
export const ModalProvider = ({ children }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    return (
        <ModalContext.Provider value={{isModalVisible, setIsModalVisible}}>
            {children}
        </ModalContext.Provider>
    );
};

export const useModal = () => React.useContext(ModalContext);