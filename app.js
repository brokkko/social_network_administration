import express from 'express';
import path from "path";
import DatabaseConnector from "./scripts/database_connector.js"
const app = express();

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'dist/gulp')));
app.use("/images", express.static(path.join(__dirname, 'public/images')));
app.set('view-engine', 'pug');
app.use(express.json({
    type: ['application/json', 'text/plain']
}));

let database = new DatabaseConnector();

app.get('/', (req, res) => {
    res.render('index.pug', );
})

app.get('/page/users', (req, res) => {
    res.render('users-page.pug', {search_mode: true});
})

app.get('/page/users/list', (req, res) => {
    res.render('users-list.pug', { search_mode: false, users_array: database.getUsers()});
})

app.post('/page/user-list/search', (req, res) => {
    res.render('users-list.pug', { search_mode: false, users_array: database.searchUsers(req.body.input)});
})

app.get('/page/complaints', (req, res) => {
    res.render('users-list.pug', { search_mode: false, users_array: []});
})

app.get('/page/blocked', (req, res) => {
    res.render('blocked-page.pug', {search_mode: false, posts_array: database.getBlockedPosts()});
})

app.post('/page/unblock/:id', (req, res) => {
    database.updatePostState(req.params.id, false, req.body.user_id);
    res.render('blocked-page.pug', { search_mode: false, posts_array: database.getBlockedPosts()});
})


app.get('/page/:id', (req, res) => {
    let user_id = req.params.id;
    res.render('user-page.pug', { user: database.getUserById(user_id)});
})

app.put('/page/role/:id', (req, res) => {
    database.updateUserRoleInfo(req.params.id, req.body.role);
})

app.put('/page/status/:id', (req, res) => {
    database.updateUserStatusInfo(req.params.id, req.body.status);
})


app.get('/page/photos/:id', (req, res) => {
    let user_id = req.params.id;
    res.render('photos-list.pug', { photos_array: database.getDataByUserId(user_id, "photo")});
})

app.get('/page/notes/:id', (req, res) => {
    let user_id = req.params.id;
    res.render('posts-list.pug', { posts_array: database.getUserPostsById(user_id, false), section: "notes", page_user: user_id});
})

app.get('/page/friends/:id', (req, res) => {
    let user_id = req.params.id;
    res.render('users-list.pug', { modepage: false, users_array: database.getFriendsByUserId(user_id)});
})

app.get('/page/news/:id', (req, res) => {
    let user_id = req.params.id;
    res.render('posts-list.pug', { posts_array: database.getUserFriendsPostsById(user_id, false), section: "news", page_user: user_id});
})

app.post('/page/notes/block/:id', (req, res) => {
    res.render('posts-list.pug', { posts_array: database.updatePostState(req.params.id, true, req.body.user_id), section: "notes"});
})

app.post('/page/news/block/:id', (req, res) => {
    database.updatePostState(req.params.id, true, req.body.user_id);
    res.render('posts-list.pug', { posts_array: database.getUserFriendsPostsById(req.body.user_id, false), section: "news"});
})

const host = '127.0.0.1';
const port = 7000;
app.listen(port, host, function () {
    console.log(`Server listens http://${host}:${port}`)
})