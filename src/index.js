import { app } from "./app.js";
import { connectDataBase } from "./db/index.js";
import dotenv from 'dotenv';

dotenv.config({
    path: "./env"
})

connectDataBase()
    .then(() => {
        app.listen(process.env.PORT || 3317, () => {
            console.log(`🌐 Server started on http://localhost:${process.env.PORT}`);
            console.log(`⚡ Listening on port ${process.env.PORT}...`);
            console.log("✅ Ready to accept requests!");
        })
    })
    .catch((err) => {
        console.log("❌ Database connection failed: \"db/index.js\" \n", err);
    })