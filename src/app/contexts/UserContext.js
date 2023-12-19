import { createContext, useContext, useState } from 'react';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState({
      name: 'John Doe',
      email: 'john.doe@example.com',
      address: '1234 Main Street, Anytown, USA',
      phone: '+1 234 567 8901',
    });

    const updateUserInfo = ({ name, email, address, phone }) => {
        setUserInfo(prevState => ({
            ...prevState,
            name: name ?? prevState.name,
            email: email ?? prevState.email,
            address: address ?? prevState.address,
            phone: phone ?? prevState.phone,
        }));
    };

    return (
        <UserContext.Provider value={{ userInfo, updateUserInfo }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
