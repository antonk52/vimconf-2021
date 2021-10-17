import fs from "fs";
import os from "os";
import path from "path";
import assert from "assert";

import arg from "arg";
import rimraf from "rimraf";

import { mdslides } from "./main";

async function main() {
  const {
    "--help": help,
    "--watch": watch,
    "--dest": dest = path.join(process.cwd(), "./dest"),
    _: [filepathArg],
  } = arg({ "--help": Boolean, "--watch": Boolean, "--dest": String });

  if (help) {
    process.stdout.write(
      [
        `mdslides is a cli tool for creating many mardown slides from a single markdown file`,
        `Usage:`,
        `mdslides ./path/to/source.md`,
        `mdslides ./path/to/source.md --watch`,
        `mdslides ./path/to/source.md --watch --dest ./path/to/slides/directory`,
      ].join(os.EOL)
    );
    process.exit(0);
  }

  assert.ok(
    filepathArg,
    "Source filepath is not provided\nexample usage: mdslides ./path/to/source.md\n"
  );

  const resolvedFilepath = path.resolve(process.cwd(), filepathArg);

  assert.ok(
    fs.existsSync(resolvedFilepath),
    `File does not exist.\n${filepathArg}`
  );
  process.stdout.write("Slides created\n");

  function createSlides() {
    if (fs.existsSync(dest)) {
      rimraf.sync(dest);
    }
    fs.mkdirSync(dest, { recursive: true });

    mdslides({ source: resolvedFilepath, dest });

    const d = new Date();
    const timestamp = `[${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}]`;
    const editor = process.env.EDITOR || "vim";

    process.stdout.write(
      `${timestamp} MDSlides created\n${editor} ${dest}/*\n`
    );
  }

  createSlides();

  if (watch) {
    fs.watchFile(resolvedFilepath, {}, createSlides);
  }
}

main().catch((e) => {
  process.stderr.write(`Unexpected mdslides error:\n\n${e.toString()}\n`);

  process.exit(1);
});
