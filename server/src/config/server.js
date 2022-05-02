import 'core-js/stable';
import 'regenerator-runtime/runtime';
import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import {ApiRouter} from '../routes';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../../../swagger.json';
// env file reading
dotenv.config();

const appInit =()=>{
  const app = express();
  const server = http.createServer(app);
  const port = process.env.PORT;
  server.listen(port, ()=>{
    console.log('server in up on port ' + port);
  });
  app.use(express.json());
  app.use(cors());

  // Express Session
  app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true,
    cookie: {maxAge: 2592000000},
  }));


  app.use( (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, OPTIONS, PUT, PATCH, DELETE',
    );
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept',
    );

    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });

  app.use(
      '/api-docs',
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument),
  );
  app.use(ApiRouter);
};

export default appInit;
