import AppModule from "./AppModule.js";
const {app, connectToMongo, start} = AppModule;

connectToMongo();

start();