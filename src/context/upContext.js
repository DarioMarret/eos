import { createContext } from 'react'

const upContext = createContext({
    Update: () => null,
});

export default upContext;