import express from 'express';
import path from 'path';

const app = express();

const ViewEngine = (app) => {
    app.set('views', path.join('./src/', 'views'));
    app.set('view engine', 'ejs');
    app.use(express.static(path.join('./src/', 'public')));
};

export default ViewEngine;
