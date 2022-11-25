import express from "express";
import Room from "../models/roomModel.js";
import io from "../server.js";
const roomsRouter = express.Router();

// Retrieve the rooms' collection data.
roomsRouter.get("/", async (req, res) => {
  // This is here for testing purposes.
  try {
    const data = await Room.find({});
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
  }
});

// Creates a new room in the database.
roomsRouter.post("/new", async (req, res) => {
  const { ID } = req.body;
  const newRoom = new Room({ ID: ID });
  await newRoom.save(function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
    }
  });

  io.emit("update", `update signal`);
  res.status(200).json({ success: true, data: [] });
});

// Retrieve a room's data.
roomsRouter.get("/:ID", async (req, res) => {
  try {
    const { ID } = req.params;
    const data = await Room.find({});
    const specificRoom = data.find((room) => room.ID === ID);
    res.status(200).json(specificRoom);
  } catch (err) {
    console.error(err);
  }
});

// Update the issue of a room.
roomsRouter.put("/:roomID", async (req, res) => {
  console.log("Sucessfully updated the issue...");
});

// Add a new player to a room.
roomsRouter.post("/:ID", async (req, res) => {
  const { ID, name, card } = req.body;

  await Room.updateOne(
    { ID: req.params.ID },
    { $push: { players: { ID, name, card } } }
  );

  res.status(201).send({ success: true, data: [] });
});

// Update the card property of a player.
// [UNDER CONSTRUCTION]
// The idea here is to check what the current value of the card property is before changing it.
// If the current value differ from the new value, then the value should be updated to the new value as one would expect.
// BUT! If the current value equals the new value, then it should update to the empty string instead.
// This will act as if the player would be canceling their vote.
// My difficulty at the momment is HOW to retrieve the current card value from the database.
roomsRouter.post("/:ID/:playerID", async (req, res) => {
  // console.log(req.params, req.body);

  // const currentPlayer = await Room.findOne({
  //   ID: req.params.ID,
  //   players: { ID: req.params.playerID },
  // });
  // console.log(currentPlayer);

  await Room.updateOne(
    { ID: req.params.ID, "players.ID": req.params.playerID },
    {
      $set: {
        "players.$.card": req.body.card,
      },
    }
  );
  res.status(201).send({ success: true, data: [] });
});

export default roomsRouter;