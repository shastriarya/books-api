require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");

connectDB();

PORT = process.env.PORT || 3000;

app.listen(PORT, (err) => {
  try {
    console.log(`server is running on the port ${PORT}`);
  } catch (err) {
    console.error(err);
  }
});
