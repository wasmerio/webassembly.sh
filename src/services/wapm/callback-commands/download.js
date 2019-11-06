import { saveSync } from "save-file";


const download = async (options, wasmFs) => {
  const filepath = options.args[1];
  let data, filename;
  try {
    if (filepath) {
      data = wasmFs.volume.readFileSync(filepath);
      const splittedPath = filepath.split("/");
      filename = splittedPath[splittedPath.length - 1];
    }
    else {
      // From stdin
      var BUFSIZE=25600000;
      let readData = new Uint8Array(BUFSIZE);
      var bytesRead;
      
      let totalBytesRead = 0;
      while (true) {
          // let partialData = new Uint8Array(BUFSIZE);
          bytesRead = wasmFs.fs.readSync(0, readData, 0, BUFSIZE, bytesRead);
          // readData = readData.join(bytesRead)
          totalBytesRead += bytesRead;
          if (bytesRead === 0) {
              break;
          }
      }
      data = readData.slice(0, totalBytesRead);
      filename = filepath || "stdin.txt";
    }
    saveSync(data, filename);
  }
  catch (e){
    return e.toString();
  }
  return "Downloading the file...";
};
export default download;
