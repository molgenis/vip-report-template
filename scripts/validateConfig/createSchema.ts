import { writeFileSync } from "fs";
import { schema } from "./schema"; // adjust the path if needed

// Write the JSON schema to file
writeFileSync("schemaConfigJson.jtd.json", JSON.stringify(schema, null, 2));
console.log("✅ Wrote schemaConfigJson.jtd.json");