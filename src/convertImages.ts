import * as fs from "fs";
import * as path from "path";
import convert from "heic-convert";
import sharp from "sharp";
import { mkdirp } from "mkdirp";

/*
  This function converts a HEIC image to a JPEG image.
  It will also delete the original HEIC image if deleteOriginal is true.
  It will also resize the image to a maximum width if maxWidth is set.
  It will also set the JPEG quality to the given value.
*/
async function convertHeicToJpg(
  inputPath: string,
  outputPath: string,
  deleteOriginal: boolean,
  maxWidth: number | null = null,
  quality: number = 80
) {
  const inputBuffer = await fs.promises.readFile(inputPath);

  // First convert HEIC to a temporary JPEG buffer
  const tempJpegBuffer = await convert({
    buffer: inputBuffer, // input buffer with a HEIC image
    format: "JPEG", // output format
  });

  let image = sharp(tempJpegBuffer, { failOnError: false }).rotate();

  if (maxWidth) {
    image = image.resize(maxWidth);
  }

  if (quality) {
    image = image.jpeg({ quality });
  }

  const outputBuffer = await image.toBuffer();

  await mkdirp(path.dirname(outputPath));
  await fs.promises.writeFile(outputPath, outputBuffer);

  if (deleteOriginal) {
    await fs.promises.unlink(inputPath);
    console.log(`Deleted original file: ${inputPath}`);
  }
}

/*
 * This function resizes a JPEG image.
 * It will also delete the original JPEG image if deleteOriginal is true.
 * It will also resize the image to a maximum width if maxWidth is set.
 * It will also set the JPEG quality to the given value.
 */
async function resizeJpgImage(
  inputPath: string,
  outputPath: string,
  deleteOriginal: boolean,
  maxWidth: number | null = null,
  quality: number = 80
) {
  let image = sharp(inputPath, { failOnError: false }).rotate();

  if (maxWidth) {
    image = image.resize(maxWidth);
  }

  if (quality) {
    image = image.jpeg({ quality });
  }

  const outputBuffer = await image.toBuffer();

  await mkdirp(path.dirname(outputPath));
  await fs.promises.writeFile(outputPath, outputBuffer);

  if (deleteOriginal) {
    await fs.promises.unlink(inputPath);
    console.log(`Deleted original file: ${inputPath}`);
  }
}

export async function traverseDirectory(
  directory: string,
  baseDirectory: string,
  outputDirectory: string,
  deleteOriginal: boolean,
  maxWidth: number | null = null,
  quality: number | null = 80
) {
  const filesAndDirectories = await fs.promises.readdir(directory);

  for (const fileOrDirectory of filesAndDirectories) {
    const fullPath = path.join(directory, fileOrDirectory);
    const stat = await fs.promises.stat(fullPath);

    if (stat.isDirectory()) {
      (await traverseDirectory(
        fullPath,
        baseDirectory,
        outputDirectory,
        deleteOriginal,
        maxWidth,
        quality
      ));
    } else if (path.extname(fullPath).toLowerCase() === ".heic") {
      const relativePath = path
        .relative(baseDirectory, fullPath)
        .toLowerCase()
        .replace(".heic", ".jpg");
      const jpgPath = path.join(outputDirectory, relativePath);
      await mkdirp(path.dirname(jpgPath));
      console.log(`Converting ${fullPath} to ${jpgPath}...`);
      await convertHeicToJpg(
        fullPath,
        jpgPath,
        deleteOriginal,
        maxWidth,
        quality
      );
    } else if (
      path.extname(fullPath).toLowerCase() === ".jpg" ||
      path.extname(fullPath).toLowerCase() === ".jpeg"
    ) {
      const relativePath = path.relative(baseDirectory, fullPath).toLowerCase();
      const jpgPath = path.join(outputDirectory, relativePath);
      await mkdirp(path.dirname(jpgPath));
      console.log(`Copying ${fullPath} to ${jpgPath}...`);
      await resizeJpgImage(
        fullPath,
        jpgPath,
        deleteOriginal,
        maxWidth,
        quality
      );
    }
  }
}
