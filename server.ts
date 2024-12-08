import express from "express";
import routing from "./app/routes";
import dotenv from "dotenv";

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const app = express();

app.use(express.json());

app.get("/", (req: any, res: any) => {
  return res.status(200).json("Hello World !");
});

app.use((req: any, res: any, next: any) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

// configuring routes of the api's
routing(app);

app.listen(4500, "0.0.0.0", async () => {
  // await prisma.$connect();
  console.log(`🚀 Server ready at: http://localhost:4500`);
});
