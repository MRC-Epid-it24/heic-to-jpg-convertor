# heic-to-jpg-image-convertor
Tool to automatically convert HEIC files (Iphone photos) into the JPEG format for bulk uploading to the Intake24 system 

1. Build the project 
   `pnpm build`

2. Run the project
  example with the max width limit: `pnpm start --input-folder=/path/to/input/root/folder --output-folder=/path/to/output/folder --max-width=2016` 

   Options:
   - **--input-folder=** - root folder that containes all the directories with the HEIC files in it. Default: **<current folder>**
   - **--output-folder** - destination folder for the converted images. If not set will put images in the same folder. Can be used with the **--delete-original** option to mutate the original files into converted ones (NOT ADVISIBLE).
   - **--delete-original** - Delete original files after conversion.
   - **--maxWidth=** - max allowed Image Width. If more then this value the image will be scaled down to it. Default: **null** - no image resizing.
   - **--quality** - compression quality for the output JPEG image. Default: **80**. Range 1-100.   

## License
MIT
