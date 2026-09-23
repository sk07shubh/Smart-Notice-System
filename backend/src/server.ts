import "dotenv/config";
import app from "./app";
import { validateEnv } from "./config/env";

const PORT = process.env.PORT ?? 5000;

validateEnv();
app.listen(PORT, () => {
    console.log(`🚀 Server listening on http://localhost:${PORT}`);
});