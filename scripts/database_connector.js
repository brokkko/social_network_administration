import fs from 'fs';

export default class DatabaseConnector {
    constructor() {
        this.database = this.#loadJSON('./database/database.json');
    }
    #loadJSON = (path) => JSON.parse(fs.readFileSync(new URL(path, import.meta.url)));

    #getStatusByStatusId = (id) => {
        return this.database["Status"][id];
    }

    getUserById = (id) => {
        for (let current_user of this.database["User"]) {
            if(current_user["id"] === id) {
                return {
                    "id": current_user["id"],
                    "name": current_user["name"],
                    "surname": current_user["surname"],
                    "birthday": current_user["birthday"],
                    "email": current_user["email"],
                    "status": this.#getStatusByStatusId(current_user["status_id"]),
                    "avatar": current_user["avatar"]
                }
            }
        }
    }

    getPhotoById = (id) => {
        for (let current_photo of this.database["Photo"]) {
            if(current_photo["id"] === id) {
                return {
                    "id": current_photo["id"],
                    "path": current_photo["path"]
                }
            }
        }
    }

    getFriendsByUserId = (id) => {
        let friends = [];
        for (let current_user of this.database["User"]) {
            if(current_user["id"] === id) {
                for(let friend_id of current_user["friend_id"]) {
                    friends.push(this.getUserById(friend_id));
                }
            }
        }
        return friends;
    }

    getDataByUserId = (id, section) => {
        let result = [];
        for (let current_user of this.database["User"]) {
            if(current_user["id"] === id) {
                for(let data_elem_id of current_user[section + "_id"]) {
                    result.push(this.getDataById(data_elem_id, section));
                }

            }
        }
        return result;
    }

    getDataById = (id, section) => {
        switch (section) {
            case "friend": return this.getUserById(id);
            case "photo": return this.getPhotoById(id);
            case "note": break;
        }
    }

    getUsers = () => {
        let users = []
        for (let current_user of this.database["User"]) {
            users.push(this.getUserById(current_user["id"]));
        }
        return users;

    }
}