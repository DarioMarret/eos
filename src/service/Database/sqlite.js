import * as SQLite from 'expo-sqlite'

const db = SQLite.openDatabase("eos_database.db")

export default db