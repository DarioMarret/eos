import { createContext } from 'react'

const userContext = createContext({
    setreloadInt: () => null,
    reloadInt: undefined,
    Token: undefined,
    login: () => null,
    logout: () => null,
});

export default userContext;