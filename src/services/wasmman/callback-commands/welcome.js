import packageJson from '../../../../package.json';
import {reset, magenta, bold, underline, boldAndUnderline} from '../../../util/ansi';

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
${reset}
`;

let welcomeMessage = `${bold}WebAssembly.sh${reset} v${packageJson.version}
@wasmer/wasm-terminal v${packageJson.dependencies['@wasmer/wasm-terminal'].replace('^', '')}
Powered by ${bold}Wasmer-JS${reset}.

${boldAndUnderline}Quick Start:${reset}

• Try a command: \`cowsay hello\`.
• Run a JS Engine in Wasm: \`quickjs\`.
• Manage Wasm modules: \`wasmman\`. 

${boldAndUnderline}Additional commands:${reset}

All the commands published on WAPM (with WASI) will be automatically available in this shell.
${underline}https://wapm.io${reset}

${boldAndUnderline}More Information:${reset}

• Usage information: \`help\`
• About the project: \`about\`

`;

if (window.SharedArrayBuffer === undefined) {
  welcomeMessage += `
${boldAndUnderline}Browser Compatibility:${reset}

Your current browser does not support SharedArrayBuffer. It is reccomended that you switch to a browser that does support this feature, such as a Chromium based browser. Your browser should still support more simple WASI commands, but inifinitely looping commands can freeze your browser, and commands that require input will require a less desireable experience. Use the command "help" for more information. Either way, ${bold}we hope you enjoy Webassembly.sh!${reset}

`;
}

export const getWelcomeMessage = () => welcomeMessage.replace(/\n\n/g, '\n \n');
const welcome = async () => getWelcomeMessage();
export default welcome;
