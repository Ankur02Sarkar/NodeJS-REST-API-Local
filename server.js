const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "data.json");

// Middleware to parse JSON request bodies
app.use(express.json());

// Helper function to read data from the JSON file
// Helper function to read data from the JSON file
const readData = () => {
  try {
    const jsonData = fs.readFileSync(DATA_FILE, "utf8"); // Specify encoding to get a string
    return JSON.parse(jsonData || "[]"); // Default to empty array if jsonData is falsy
  } catch (error) {
    console.error("Error reading or parsing data.json:", error);
    return []; // Return an empty array on error
  }
};

// Helper function to write data to the JSON file
const writeData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// CRUD Endpoints

// GET /items - Retrieve all items
app.get("/items", (req, res) => {
  const data = readData();
  res.json(data);
});

// GET /items/:id - Retrieve a single item by ID
app.get("/items/:id", (req, res) => {
  const { id } = req.params;
  const data = readData();
  const item = data.find((item) => item.id === id);

  if (!item) {
    return res.status(404).json({ error: "Item not found" });
  }

  res.json(item);
});

// POST /items - Create a new item
app.post("/items", (req, res) => {
  const data = readData();
  const newItem = { id: Date.now().toString(), ...req.body };

  data.push(newItem);
  writeData(data);

  res.status(201).json(newItem);
});

// PUT /items/:id - Update an existing item
app.put("/items/:id", (req, res) => {
  const { id } = req.params;
  const data = readData();
  const itemIndex = data.findIndex((item) => item.id === id);

  if (itemIndex === -1) {
    return res.status(404).json({ error: "Item not found" });
  }

  data[itemIndex] = { ...data[itemIndex], ...req.body };
  writeData(data);

  res.json(data[itemIndex]);
});

// DELETE /items/:id - Delete an item
app.delete("/items/:id", (req, res) => {
  const { id } = req.params;
  const data = readData();
  const newData = data.filter((item) => item.id !== id);

  if (newData.length === data.length) {
    return res.status(404).json({ error: "Item not found" });
  }

  writeData(newData);
  res.status(204).send();
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
