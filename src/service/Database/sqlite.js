import * as SQLite from 'expo-sqlite'

const db = SQLite.openDatabase({
    name: "eos_database.db",
    location: "default",
    createFromLocation: "~eos_database.db",
    version: "1.0",
    description: "EOS Database",
    size: 2000000
})

export default db