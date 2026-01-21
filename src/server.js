require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/database");

const startServer = () => {

    connectDB();

    const PORT = process.env.PORT;
    app.listen(PORT, () => {
        console.log(`Server start at http://localhost:${PORT}`);
    });

}


startServer();