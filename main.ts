//@deno-types="npm:@types/express@4"

import express, { Request, Response } from "npm:express";
import {
  Database,
  MongoClient,
} from "https://deno.land/x/mongo@v0.32.0/mod.ts";

import { load } from "https://deno.land/std@0.218.0/dotenv/mod.ts";

const env = await load();
const password = env["PASS"];
const user = env["USER"];

const connectMongoDB = async (): Promise<Database> => {
  const mongo_usr = user;
  const mongo_pwd = password;
  const db_name = "supermondongos";
  const mongo_uri = "mongomake.3ta2r.mongodb.net";
  const mongo_url = `mongodb+srv://${mongo_usr}:${mongo_pwd}@${mongo_uri}/${db_name}?authMechanism=SCRAM-SHA-1`;
  const client = new MongoClient();
  await client.connect(mongo_url);
  const db = client.database(db_name);
  return db;
};

const db = await connectMongoDB();
const pokedex = db.collection("pokemon");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response): void => {
  pokedex
    .find({})
    .toArray()
    .then((e) => {
      const filteredE = e.map((e) => {
        delete e.creator;
        return e;
      });
      res.json(filteredE);
    });
});

app.get("/:name", (req: Request, res: Response): void => {
  const name = req.params.name;
  pokedex
    .find({ name: { $regex: name, $options: "i" } })
    .toArray()
    .then((e) => {
      const filteredE = e.map((e) => {
        delete e.creator;
        return e;
      });
      res.json(filteredE);
    });
});

app.post("/", async (req: Request, res: Response) => {
  const { name, image, sound, creator } = req.body;
  if (
    name === undefined ||
    image === undefined ||
    sound === undefined ||
    creator === undefined ||
    name === "" ||
    image === "" ||
    sound === "" ||
    creator === ""
  ) {
    res.status(400).json({ message: "La liaste chavalín, rellenamelo bien" });
    return;
  } else if (!image.match(/\.(jpeg|jpg|png)$/) || !sound.match(/\.(mp3)$/)) {
    res
      .status(400)
      .json({ message: "Solo se permiten imágenes jpg o png y audios mp3" });
    return;
  }
  const repeated = await pokedex.findOne({ name });
  if (repeated) {
    res.status(400).json({ message: "Repeated name" });
    return;
  }
  const { $oid } = await pokedex.insertOne({ name, image, sound, creator });
  res.status(201).json({ _id: $oid });
});

app.delete("/:name", async (req: Request, res: Response) => {
  const name = req.params.name;
  const creator = req.body.creator;
  if (creator === undefined) {
    res.status(400).json({ message: "No creator" });
    return;
  }
  const deleted = await pokedex.deleteOne({ name, creator });
  if (deleted === 0) {
    res.status(404).json({ message: "Not found" });
    return;
  } else {
    res.status(204).json({ message: "Deleted" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
