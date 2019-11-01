import { wapm } from "../../../functions/fetch-command";
import { save } from "save-file";

function stringToUint(string) {
  var charList = string.split(''),
      uintArray = [];
  for (var i = 0; i < charList.length; i++) {
      uintArray.push(charList[i].charCodeAt(0));
  }
  return new Uint8Array(uintArray);
}


const download = async (args, stdin) => {
  const filepath = args[1];
  let data, filename;
  try {
    if (stdin) {
      data = stringToUint(stdin);
      console.log(data);
      filename = filepath || "stdin";
      return "a";
    }
    else if (filepath) {
      data = wapm.wasmFs.volume.readFileSync(filepath);
      const splittedPath = filepath.split("/");
      filename = splittedPath[splittedPath.length - 1];
    }
    else {
      throw new Error("You need to provide a filename or stdin");
    }
    await save(data, filename);
  }
  catch (e){
    return e.toString();
  }
  return "Downloading the file...";
};
export default download;
