import { createContext } from 'react'

const userContext = createContext({
    isOFFLINE: undefined,
    setreloadInt: () => { },
    reloadInt: undefined,

    Token: undefined,
    login: () => null,
    logout: () => null,
});

export default userContext;