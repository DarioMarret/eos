import db from "./Database/model";


export const getCantonesStorageBy = async (id) => {
    try {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    `SELECT * FROM cantones WHERE id = ?`,
                    [id],
                    (tx, results) => {
                        if (results.rows._array.length > 0) {
                            resolve(results.rows._array)
                        } else {
                            resolve(false)
                        }
                    })
            })
        })
    } catch (error) {
        console.log("getCantonesStorageBy-->", error);
        return null;
    }
}