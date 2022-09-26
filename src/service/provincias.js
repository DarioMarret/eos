import db from "./Database/model";


export const getProvinciasStorageBy = async (id) => {
    try {
        console.log("id provincia que se consultara",id)
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql('SELECT * FROM provincias WHERE id = ?', [id], (_, { rows }) => {
                    resolve(rows._array);
                });
            });
        })
    } catch (error) {
        console.log("getProvinciasStorageBy-->", error);
        return null;
    }
}