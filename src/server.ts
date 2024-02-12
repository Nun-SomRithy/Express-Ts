// import BodyParser from "body-parser";
// import adminRoute from "./routes/admin"; // Import the route
// import shopRoute from "./routes/shop";
// import path from "path";
import  mongoose from "mongoose"; // Import the route
import  env from "./utills/validateEnv"
import app  from "./app";
import connectDB from "./configs/dbConn";


const port = env.PORT;
connectDB().then(r => {})
mongoose.connection.once("open", () => {
    app.listen(port, () => {
        console.log(`[server]: Server is running at http://localhost:${port}`);
    });
})

mongoose.connection.on("error", (error) => {
    console.error("Error: ", error);
})

/*// server.use(BodyParser.json()); // for parsing application/json
/!*server.use('/',(req: Request, res: Response, next) => {
  console.log("another middleware 1");
  // next();
});

server.use('/user',(req: Request, res: Response, next) => {
  console.log("another middleware 2");
  res.send("another middleware 2");
});*!/    //middleware

// server.use('/admin',adminRoute);
// server.use(shopRoute);
// server.use((req, res, next) => {
//     res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
// })*/


