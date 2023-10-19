#!/usr/bin/env node

/**
 * Parse list and return update command.
 *   
 * ┌────────────────────────┬─────────┬─────────┐
 * │ Package                │ Current │ Latest  │
 * ├────────────────────────┼─────────┼─────────┤
 * │ @types/node (dev)      │ 20.8.2  │ 20.8.3  │
 * ├────────────────────────┼─────────┼─────────┤
 * │ @types/react-dom (dev) │ 18.2.10 │ 18.2.11 │
 * └────────────────────────┴─────────┴─────────┘
 * 
 * Update command: 
 * pnpm i @types/node@latest @types/react-dom@latest 
 * 
 * package.json: "outdated": "pnpm ./get-update-dependences.js"
 * chmod +x ./get-update-dependences.js
 * 
 * Run: pnpm run outdated
 **/

const { exec } = require("child_process");
const command = "pnpm outdated | tee"

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`error: ${error.message}`);
    return;
  }

  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }

  console.info(stdout);

  let updateCommand = "pnpm i "

  const lines = stdout.split("\n")

  for (const line of lines) {
    if ((line.indexOf("─") !== -1) || line.startsWith("│ Package ")) {
      continue;
    }

    const parsed = line.split("│")

    if (parsed.length < 3) continue;

    const packedge = parsed[1].replace("(dev)", "").trim()
    // const latest = parsed[3].trim()

    updateCommand += packedge + "@latest "
  }

  console.info("Update command")
  console.info(updateCommand)
});