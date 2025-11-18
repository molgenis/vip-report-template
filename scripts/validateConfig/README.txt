If the schema is updated, either the schema.ts or its dependencies, run the following to generate a new validator:
"npx tsx .\scripts\validateConfig\createSchema.ts"
and
"npx tsx .\scripts\validateConfig\compileValidator.ts"
this will create a new version of the validator in: src/utils/config/configValidator.precompiled.ts