import fs from "fs";
import os from "os";
import path from "path";
import rimraf from "rimraf";

interface Slide {
  title: string;
  start: number;
  end: number;
}

interface Options {
  /**
   * Path to the source markdown file
   */
  source: fs.PathLike;
  /**
   * Path to where the created slides go
   */
  dest: string;
}
export function mdslides({ source, dest }: Options) {
  const pathToFile = source;
  const content = fs.readFileSync(pathToFile).toString();

  const lines = content.split(os.EOL);

  const slides = lines.reduce<{
    slides: Slide[];
    cur: { start: number; title: string };
  }>(
    (acc, line, i) => {
      if (i == 0) {
        return acc;
      }

      if (i == lines.length - 1) {
        acc.slides.push(Object.assign({ end: i }, acc.cur));
        return acc;
      }

      if (line.startsWith("#")) {
        acc.slides.push(Object.assign({ end: i - 1 }, acc.cur));

        acc.cur = { start: i, title: line };

        return acc;
      }

      return acc;
    },
    { slides: [], cur: { start: 0, title: lines[0] } }
  ).slides;

  if (fs.existsSync(dest)) {
    rimraf.sync(dest);
  }

  fs.mkdirSync(dest);

  slides.forEach((slide, i) => {
    const slideText = lines
      .slice(slide.start, slide.end)
      .filter((line) => !line.startsWith("<!--"))
      .join(os.EOL)
      .replace(/\n\n\n/g, "\n\n")
      .trim();
    const slideIndex = String(i + 1).padStart(3, "0");

    fs.writeFileSync(path.join(dest, `${slideIndex}.md`), slideText);
  });
}
