import * as fs from "fs";
import * as path from "path";

type InputObject = {
  type: "file" | "folder";
  name: string;
  children?: InputObject[];
};

type OutputObject = {
  id: string;
  description: string;
  selectionImagePath: string;
  images: { imagePath: string; weight: number; imageKeywords: [] }[];
};

// Generate a unique ID - placeholder function
const generatedId = function (): string {
  return "MY_" + Math.random().toString(36).substring(2, 15);
};

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
    } else {
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

// Function to transform the input array into the desired output format
const transform = (input: InputObject[]): OutputObject[] => {
  let output: OutputObject[] = [];

  input.forEach((item) => {
    if (item.type === "folder") {
      output.push({
        id: generatedId(), // Replace with your ID generation logic
        description: item.name,
        selectionImagePath: "", // Set this based on your logic
        images:
          item.children
            ?.filter((child) => child.type === "file")
            .map((child) => ({
              imagePath: item.name + "/" + child.name,
              weight: parseInt(child.name.match(/_(\d+)/)?.[1] || ""),
              imageKeywords: [],
            })) || [],
      });
    }
  });

  return output;
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

  // Transform the input
  const outputArray = transform(structureJSON);

  // Write the output to a file
  await fs.promises.writeFile(
    path.join(outputFolder, "output.json"),
    JSON.stringify(outputArray, null, 2)
  );
}
