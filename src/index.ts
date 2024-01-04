import { Argument, Command, Option } from "commander";
import * as process from "process";
import { traverseDirectory } from "./convertImages";
import { generateAsServed } from "./generateAsServed";
import pkg from "../package.json";

const run = async () => {
  const program = new Command();

  program.name("Intake24 CLI");
  program.version(pkg.version);

  program
    .command("convert-images")
    .description("Convert HEIC images to JPEG")
    .requiredOption(
      "--input-folder <path>",
      "Path to the folder containing HEIC images"
    )
    .option(
      "--output-folder <path>",
      "Path to the folder where converted images will be stored. Defaults to the input folder."
    )
    .option(
      "--delete-original",
      "Delete original HEIC images after conversion",
      false
    )
    .option(
      "--max-width <number>",
      "Maximum width of the converted images. Defaults to the original width."
    )
    .option(
      "--quality <number>",
      "JPEG quality. Defaults to 80.",
      (value) => parseInt(value),
      80
    )
    .action(async (options) => {
      await traverseDirectory(
        options.inputFolder,
        options.inputFolder,
        options.outputFolder ?? options.inputFolder,
        options.deleteOriginal,
        options.maxWidth.length > 0 ? parseInt(options.maxWidth) : null,
        options.quality.length > 0 ? parseInt(options.quality) : null
      );
      console.log("Conversion completed.");
    });

  program
    .command("generate-as-served")
    .description("Generate as served JSON array from the given folder)")
    .requiredOption(
      "--input-folder <path>",
      "Path to the folder containing images"
    )
    .requiredOption(
      "--generation-method <method>",
      "Please select the generation method. Options are: 'name-based', 'csv-based', 'json-based'"
    )
    .option(
      "--output-folder <path>",
      "Path to the folder where JSON will be stored. Defaults to the input folder."
    )
    .action(async (options) => {
      await generateAsServed(
        options.inputFolder,
        options.generationMethod,
        options.outputFolder ?? options.inputFolder
      );
      console.log("Generation completed.");
    });

    await program.parseAsync(process.argv);
};

// Run the program
run()
  .catch((err) => {
    console.error(err instanceof Error ? err.stack : err);

    process.exit(process.exitCode ?? 1);
  })
  .finally(() => {
    process.exit(process.exitCode ?? 0);
  });
