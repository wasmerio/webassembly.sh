import packageJson from "../../../../package.json";
import {
  reset,
  magenta,
  bold,
  underline,
  boldAndUnderline,
} from "../../../util/ansi";

const wasmerAscii = `
${magenta}               ww            
${magenta}               wwwww         
${magenta}        ww     wwwwww  w     
${magenta}        wwwww      wwwwwwwww 
${magenta}ww      wwwwww  w     wwwwwww
${magenta}wwwww      wwwwwwwwww   wwwww
${magenta}wwwwww  w      wwwwwww  wwwww
${magenta}wwwwwwwwwwwwww   wwwww  wwwww
${magenta}wwwwwwwwwwwwwww  wwwww  wwwww
${magenta}wwwwwwwwwwwwwww  wwwww  wwwww
${magenta}wwwwwwwwwwwwwww  wwwww  wwwww
${magenta}wwwwwwwwwwwwwww  wwwww   wwww
${magenta}wwwwwwwwwwwwwww  wwwww       
${magenta}   wwwwwwwwwwww   wwww       
${magenta}       wwwwwwww              
${magenta}           wwww              
${reset}`;

const wasmShVersion = packageJson.version;
const wasmerWasmTerminalVersion = packageJson.dependencies['@wasmer/wasm-terminal'].replace('^', '');

let welcomeMessage = `
${bold}WebAssembly.sh${reset} v${wasmShVersion}
Powered by Wasmer-JS
    @wasmer/wasm-terminal v${wasmerWasmTerminalVersion}

QUICK START:
    • Try a command: \`cowsay hello\`.
    • Run a JS Engine in Wasm: \`quickjs\`.
    • Manage Wasm modules: \`wapm\`. 

ADDITIONAL COMMANDS:
    All WASI packages published on WAPM.io are automatically
    available in this shell: https://wapm.io/interface/wasi

MORE INFO:
    • Usage information: \`help\`
    • About the project: \`about\``;

// Only show the Wasmer logo if the browser is big enough
if (window.innerWidth > 800) {
  let welcomeMessageSplitted = welcomeMessage.split("\n");
  let splittedLogo = wasmerAscii.split("\n");
  if (welcomeMessageSplitted.length > splittedLogo.length) {
    splittedLogo = splittedLogo.concat(new Array(welcomeMessageSplitted.length-splittedLogo.length));
  }
  welcomeMessage = splittedLogo
    .map(function(e, i) {
      return ` ${e||""}    ${reset}${welcomeMessageSplitted[i]||""}`;
    })
    .join("\n");
}

let modifiedWelcomeMessage = ``;
if (window.SharedArrayBuffer === undefined) {
  welcomeMessage += `

BROWSER COMPATIBILITY:
    Your current browser does not support SharedArrayBuffer.
    Your browser should still support more simple WASI commands, but:
        • Inifinitely looping commands ${bold}can freeze your browser${reset}
        • Commands that require input will have a worse UX (via prompt)
    Use the command "help" for more information.
`;
}

export const getWelcomeMessage = () => welcomeMessage.replace(/\n\n/g, "\n \n");
const welcome = async () => getWelcomeMessage();
export default welcome;
