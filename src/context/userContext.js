import { createContext } from 'react'

const userContext = createContext({
    Token: undefined,
    login: () => null,
    logout: () => null,
});

export default userContext;