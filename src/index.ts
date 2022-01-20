import express from "express";
import { ApolloServerPluginLandingPageGraphQLPlayground} from 'apollo-server-core';
import bodyParser from 'body-parser';
import "reflect-metadata";
import {createConnection} from 'typeorm';
import {ApolloServer} from "apollo-server-express";
import  typeDefs  from "../src/schema/typeDefs/typedef";
import  resolvers  from "../src/schema/resolvers/resolver";
//require("dotenv").config();
//import { applyMiddleware } from "graphql-middleware";
import http from "http";
import cors from "cors";



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


const app = express();

// app.use((_,res)=>{
//   res.send("Hello from apollo server");
// });



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

const server = new ApolloServer({ typeDefs, resolvers,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  introspection: true});

//server.applyMiddleware({app,path: "/graphql", cors: false});



// postgres().then(async ()=>{

//     console.log(`database synced!`);

// }).catch((err)=>{
//   console.error(err);
// });




  const httpServer = http.createServer(app);
  
//   httpServer.listen({ port: 3000 }, () => {
//     console.log(
//       `Apollo server ready at http://localhost:3000/graphql`
//     );
//   });



postgres()
  .then(async () => {
    console.log("Postgres Connected!!");
    await server.start();
    server.applyMiddleware({ app,path: "/graphql"});

    httpServer.listen(4000, async () => {
      console.log("Server started on localhost:4000");
    });
  })
  .catch((error) => console.error(error));
