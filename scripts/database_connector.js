import fs from 'fs';

export default class DatabaseConnector {
    constructor() {
        this.database = this.#loadJSON('./database/database.json');
    }
    #loadJSON = (path) => JSON.parse(fs.readFileSync(new URL(path, import.meta.url)));

    #updateDatabase = () => {
        const jsonContent = JSON.stringify(this.database);
        fs.writeFileSync('./scripts/database/database.json', JSON.stringify(this.database));
    }

    #getStatusByStatusId = (id) => {
        return this.database["Status"][id];
    }

    #getRoleByRoleId = (id) => {
        return this.database["Role"][id];
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
                    "role": this.#getRoleByRoleId(current_user["role_id"]),
                    "avatar": current_user["avatar"]
                }
            }
        }
    }

    #getPhotoById = (id, blocked) => {
        for (let current_photo of this.database["Photo"]) {
            if(current_photo["id"] === id) {
                if(blocked === current_photo["blocked"]) {
                    return {
                        "id": current_photo["id"],
                        "path": current_photo["path"]
                    }
                } else return null;
            }
        }
    }

    #getPostById = (post_id, blocked) => {
        for(let current_post of this.database["Post"]) {
            if(current_post["id"] === post_id) {
                if(blocked === current_post["blocked"]) {
                    let current_user = this.getUserById(current_post["user_id"]);
                    let current_photo = this.#getPhotoById(current_post["photo_id"], blocked);
                    return {
                        "id": post_id,
                        "info": current_post["info"],
                        "photo_path": current_photo["path"],
                        "user_name": current_user["name"],
                        "user_surname": current_user["surname"],
                        "user_avatar": current_user["avatar"],
                        "user_id": current_post["user_id"]
                    }
                } else {
                    return null;
                }

            }
        }
    }

    getUserPostsById = (id, blocked) => {
        let posts = [];
        for (let current_user of this.database["User"]) {
            if(current_user["id"] === id) {
                for(let posts_id of current_user["post_id"]) {
                    let post = this.#getPostById(posts_id, blocked);
                    if(post !== null)
                        posts.push(post);
                }
            }
        }
        return posts;
    }

    getBlockedPosts = () => {
        let posts = [];
        for (let current_user of this.database["User"]) {
            for(let posts_id of current_user["post_id"]) {
                let post = this.#getPostById(posts_id, true);
                if(post !== null)
                    posts.push(post);
            }
        }
        return posts;
    }

    #shuffle = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

    getUserFriendsPostsById = (id, blocked) => {
        let friends = this.getFriendsByUserId(id);
        let posts = [];
        for (let current_friend of friends) {
            if(current_friend["status"] !== 'Заблокированный') {
                for(let elem of this.getUserPostsById(current_friend["id"], blocked)) {
                    posts.push(elem);
                }
            }
        }
        posts = this.#shuffle(posts);
        return posts;
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
                    let data = this.#getDataById(data_elem_id, section);
                    if (data !== null)
                        result.push(this.#getDataById(data_elem_id, section));
                }

            }
        }
        return result;
    }

    #getDataById = (id, section) => {
        switch (section) {
            case "friend": return this.getUserById(id);
            case "photo": return this.#getPhotoById(id, false);
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

    updateUserRoleInfo = (user_id, updated_info) => {
        for (let current_user of this.database["User"]) {
            if(current_user["id"] === user_id) {
                if(updated_info === "Администратор") {
                    current_user['role_id'] = 'r1';
                } else {
                    current_user['role_id'] = 'r2';
                }
                break;
            }
        }
        this.#updateDatabase();
    }

    updateUserStatusInfo = (user_id, updated_info) => {
        for (let current_user of this.database["User"]) {
            if(current_user["id"] === user_id) {
                if(updated_info === "Не подтверждён") {
                    current_user['status_id'] = 's1';
                } else if(updated_info === "Активный")  {
                    current_user['status_id'] = 's2';
                } else if(updated_info === "Заблокированный")  {
                    current_user['status_id'] = 's3';
                }
                break;
            }
        }
        this.#updateDatabase();
    }

    updatePostState = (post_id, toBlock, user_id) => {
        for (let current_post of this.database["Post"]) {
            if(current_post["id"] === post_id) {
                current_post['blocked'] = toBlock;
                this.updatePhotoState(current_post["photo_id"], toBlock);
                break;
            }
        }
        this.#updateDatabase();
        return this.getUserPostsById(user_id, false);
    }

    updatePhotoState = (photo_id, toBlock) => {
        for (let current_photo of this.database["Photo"]) {
            if(current_photo["id"] === photo_id) {
                current_photo['blocked'] = toBlock;
                break;
            }
        }
    }

    searchUsers = (input) => {
        let users = [];
        for (let current_user of this.database["User"]) {
            let user_string1 = current_user["name"].toUpperCase() + " " + current_user["surname"].toUpperCase();
            let user_string2 = current_user["surname"].toUpperCase() + " " + current_user["name"].toUpperCase();
            if(user_string1.indexOf(input.toUpperCase()) !== -1 || user_string2.indexOf(input.toUpperCase()) !== -1){
                users.push(current_user);
            }
        }
        return users;
    }



}