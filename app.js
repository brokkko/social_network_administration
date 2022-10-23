import express from 'express';
import path from "path";
import {Page_Type , Page_Section_Type} from "./scripts/types.js";
import DatabaseConnector from "./scripts/database_connector.js"
const app = express();

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'dist/gulp')))
app.set('view-engine', 'pug')

let database = new DatabaseConnector();

app.get('/', (req, res) => {
    let user_id = "87daa3e5-ab12-417a-89ce-db24764c3a7b";
    // res.render('index.pug', { page: Page_Type.USER_PAGE, users_array: database.getUsers(),
    //     user: database.getUserById(user_id), section: Page_Section_Type.FRIENDS,
    //     section_info: database.getFriendsByUserId(user_id)})
    res.render('index.pug')
})

app.get('/page/users', (req, res) => {
    res.render('users-list.pug', { search_mode: true, users_array: database.getUsers()})
})

app.get('/page/complaints', (req, res) => {
    res.render('users-list.pug', { search_mode: false, users_array: []})
})

app.get('/page/blocked', (req, res) => {
    res.render('users-list.pug', { search_mode: false, users_array: []})
})


app.get('/page/:id', (req, res) => {
    let user_id = req.params.id;
    res.render('user-page.pug', { user: database.getUserById(user_id)});
})


app.get('/page/photos/:id', (req, res) => {
    let user_id = req.params.id;
    res.render('photos-list.pug', { photos_array: database.getDataByUserId(user_id, "photo")});
})

app.get('/page/notes/:id', (req, res) => {
    let user_id = req.params.id;
    res.render('index.pug', { page: Page_Type.USER_PAGE, user: database.getUserById(user_id),
        section: Page_Section_Type.POSTS, section_info: database.getFriendsByUserId(user_id)});
})

app.get('/page/friends/:id', (req, res) => {
    let user_id = req.params.id;
    res.render('users-list.pug', { modepage: false, users_array: database.getFriendsByUserId(user_id)});
})

app.get('/page/news/:id', (req, res) => {
    let user_id = req.params.id;
    res.render('index.pug', { page: Page_Type.USER_PAGE, user: database.getUserById(user_id),
        section: Page_Section_Type.NEWS, section_info: database.getFriendsByUserId(user_id)});
})

const host = '127.0.0.1';
const port = 7000;
app.listen(port, host, function () {
    console.log(`Server listens http://${host}:${port}`)
})