import { traverseDirectory } from './convertImages';

// Parsing command-line arguments
const rootDirectoryArg = process.argv.find(arg => arg.startsWith('--input-folder='));
const rootDirectory = rootDirectoryArg ? rootDirectoryArg.split('=')[1] : './input';
const deleteOriginal = process.argv.includes('--delete-original');
const outputFolderArg = process.argv.find(arg => arg.startsWith('--output-folder='));
const outputFolder = outputFolderArg ? outputFolderArg.split('=')[1] : rootDirectory;
const maxWidthArg = process.argv.find(arg => arg.startsWith('--max-width='));
const maxWidth = maxWidthArg ? parseInt(maxWidthArg.split('=')[1]) : null;
const qualityArg = process.argv.find(arg => arg.startsWith('--quality='));
const quality = qualityArg ? parseInt(qualityArg.split('=')[1]) : 80; // Default quality is 80

traverseDirectory(rootDirectory, rootDirectory, outputFolder, deleteOriginal, maxWidth, quality).then(() => console.log('Conversion completed.'));