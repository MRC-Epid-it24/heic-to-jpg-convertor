import * as fs from "fs";
import * as path from "path";

const structure = async function traverseDirectory(inputFolder: string) {
  const filesAndDirectories = await fs.promises.readdir(inputFolder);
  let structure = [];
  for (const fileOrDirectory of filesAndDirectories) {
    const fullPath = path.join(inputFolder, fileOrDirectory);
    const stat = await fs.promises.stat(fullPath);
    if (stat.isDirectory()) {
      structure.push({
        type: "folder",
        name: fileOrDirectory,
        children: await traverseDirectory(fullPath),
      });
    } else if (fileOrDirectory === ".DS_Store") {
        // ignore
    }
    else {
      structure.push({
        type: "file",
        name: fileOrDirectory,
      });
    }
  }
  return structure;
};

//traverse array of objects and print out all nested objects and their values
const traverseAndPrint = function (o: Array<any>) {
  for (var i in o) {
    if (!!o[i] && typeof o[i] == "object") {
      console.log(i, o[i]);
    //   traverseAndPrint(o[i]);
    } 
    // else {
    //   console.log(i, o[i]);
    // }
  }
};

export async function generateAsServed(
  inputFolder: string,
  generationMethod: string,
  outputFolder: string
) {
  console.info("Generating as served JSON...");
  console.log("Input folder: " + inputFolder);
  console.log("Generation method: " + generationMethod);
  console.log("Output folder: " + outputFolder);

  const structureJSON = await structure(inputFolder);
  traverseAndPrint(structureJSON);

  //
}
