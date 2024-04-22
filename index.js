import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client ({
  user: "postgres",
  password: "1234567",
  database: "permalist",
  host: "localhost",
  port: "5432"
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


async function items() {
  const response = await db.query(`SELECT * FROM ITEMS ORDER BY ID;`);
  console.log(response.rows);
  return response.rows;
}


app.get("/",async (req, res) => {
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: await items(),
  });
});

app.post("/add",async (req, res) => {
  const item = req.body.newItem;
  await db.query(`INSERT INTO ITEMS (TITLE) VALUES ('${item}');`);
  res.redirect("/");
});

app.post("/edit",async (req, res) => {
  const id = parseInt(req.body.updatedItemId);
  const title = req.body.updatedItemTitle;
  await db.query(`UPDATE ITEMS SET TITLE = '${title}' WHERE ID = ${id}`);
  res.redirect("/");
});

app.post("/delete",async (req, res) => {
  const id = parseInt(req.body.deleteItemId);
  await db.query(`DELETE FROM ITEMS WHERE ID = ${id}`);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
