const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/audit", require("./routes/audit"));
app.use("/api/crawl", require("./routes/crawl"));
app.use("/api/comparison", require("./routes/comparison"));
app.use("/api/history", require("./routes/history"));
app.use("/api/export", require("./routes/export"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
