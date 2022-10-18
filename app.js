import express from 'express';
import path from "path";
const app = express();

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'dist/gulp')))
app.set('view-engine', 'pug')

app.get('/', (req, res) => {
    res.render('index.pug', { pageTitle: "Nikita Loh", youAreUsingPug: true })
})

const host = '127.0.0.1';
const port = 7000;
app.listen(port, host, function () {
    console.log(`Server listens http://${host}:${port}`)
})