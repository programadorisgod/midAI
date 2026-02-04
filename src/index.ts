import { app } from "./app.js";
import { env } from "./config/env.js";
const PORT = env.PORT || process.argv[2] || 3000;

import { config } from "@dotenvx/dotenvx";
config();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
