import packageJson from '../../../../package.json';

const reset = "\x1B[0m";
const magenta = `${reset}\x1B[34;1m`;
const bold = `${reset}\x1B[1m`;
const underline = `${reset}\x1B[4m`;
const boldAndUnderline = `${reset}\x1B[1m\x1B[4m`;

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

const welcomeMessage = `${bold}WebAssembly Shell${reset} v${packageJson.version}
Powered by ${bold}wasmer-js${reset}.

${boldAndUnderline}Quick Start:${reset}

• Try a command: \`cowsay hello\`.
• Run a JS Engine in Wasm: \`qjs\`.
• Manage Wasm modules: \`wasmman\`. 

${boldAndUnderline}Additional commands:${reset}

All the commands published on WAPM (with WASI) will be automatically available in this shell.
${underline}https://wapm.io${reset}

${boldAndUnderline}More Information:${reset}

• Usage information: \`help\`
• About the project: \`about\`

`;

export const getWelcomeMessage = () => welcomeMessage.replace(/\n\n/g, '\n \n');
const welcome = async () => getWelcomeMessage();
export default welcome;
