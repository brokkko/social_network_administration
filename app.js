import express from 'express';
import path from "path";
const app = express();

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'dist/gulp')))
app.set('view-engine', 'pug')

app.get('/', (req, res) => {
    res.render('index.pug', { page: "user_page", users_array: [1, 2, 3, 4, 5, 6]})
})

const host = '127.0.0.1';
const port = 7000;
app.listen(port, host, function () {
    console.log(`Server listens http://${host}:${port}`)
})