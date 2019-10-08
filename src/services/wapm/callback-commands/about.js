import packageJson from '../../../../package.json';
import {reset, magenta, bold, underline, boldAndUnderline} from '../../../util/ansi';

const message = `WebAssembly.sh is an open-source terminal that uses the WebAssembly Package Manager (WAPM) and local files to run server-side Wasm / WASI modules in a shell-like interface!

→ Website:  https://webassembly.sh/
→ Source:   https://github.com/wasmerio/webassembly.sh

FEATURES:
    • WebAssembly.sh is powered by ${bold}Wasmer-JS${reset}.
      Source Code: https://github.com/wasmerio/wasmer-js

    • WebAssembly.sh uses WAPM as its source for Wasm Modules
      Website: https://wapm.io/

Built with ❤️  by the Wasmer team.`;

export const getMessage = () => message.replace(/\n\n/g, '\n \n');
const about = async () => getMessage();
export default about;
