import express from "express";
import bodyParser from 'body-parser';
import "reflect-metadata";
import {createConnection} from 'typeorm';
import { ApolloServer } from "apollo-server-express";
import  typeDefs  from "../src/schema/typeDefs/typedef";
import  resolvers  from "../src/schema/resolvers/resolver";
require("dotenv").config();
import http from "http";
import cors from "cors";



const app=express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

const postgres = () => {
    return createConnection({
        type: 'postgres',
        database: 'test',
        username: 'postgres',
        password: 'uttupg',
        logging: true,
        synchronize: true,
        entities: []
    });
}

const server = new ApolloServer({ typeDefs, resolvers,introspection: true });
server.applyMiddleware({app,path: "/graphql", cors: false});



postgres().then(async ()=>{

    console.log(`database synced!`);

}).catch((err)=>{
  console.error(err);
});


app.use((_,res)=>{
    res.send("Hello from apollo server");
});


  const httpServer = http.createServer(app);
  
  httpServer.listen({ port: 3000 }, () => {
    console.log(
      `Apollo server ready at http://localhost:3000/graphql`
    );
  });


// postgres()
//   .then(async () => {
//     console.log("Postgres Connected!!");
//     server.applyMiddleware({ app });

//     httpServer.listen(4000, async () => {
//       console.log("Server started on localhost:4000");
//     });
//   })
//   .catch((error) => console.error(error));