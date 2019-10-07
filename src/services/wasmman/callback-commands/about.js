import packageJson from '../../../../package.json';
import {reset, magenta, bold, underline, boldAndUnderline} from '../../../util/ansi';

const message = `
${bold}WebAssembly.sh${reset} v${packageJson.version} About

${bold}WebAssembly.sh - The WebAssembly / WASI Online Terminal${reset}

WebAssembly.sh is an open-source Progressive Web App ( PWA ) terminal that uses the WebAssembly Package Manager (WAPM) and local files to run server-side Wasm / WASI modules in a shell-like interface!

Website: https://webassembly.sh/

Source Code: https://github.com/wasmerio/webassembly.sh

${bold}WebAssembly.sh is powered by Wasmer-JS${reset}.

Wasmer-JS is a collection of open-source, installable packages for running WASI modules in Node and the browser!

Source Code: https://github.com/wasmerio/wasmer-js

${bold}WebAssembly.sh uses WAPM as its source for Wasm Modules / Package Manager${reset}.

WAPM is the WebAssembly Package Manager.

Website: https://wapm.io/

Built by the Wasmer team.

`;

export const getMessage = () => message.replace(/\n\n/g, '\n \n');
const about = async () => getMessage();
export default about;
