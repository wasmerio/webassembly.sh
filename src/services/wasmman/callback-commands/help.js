import {reset, magenta, bold, underline, boldAndUnderline} from '../../../util/ansi';

const message = `
${bold}Running a command:${reset}

To run a command, type the command name, and then press enter. For example, if we wanted to run the command "cowsay", and pass the argument "hello", we would type "cowsay hello", and then press the enter key. If the command ("cowsay") is already installed, meaning it was uploaded by you, or downloaded from WAPM ( https://wapm.io ) then it will run immediately. If the command is not installed on your machine, Webassembly.sh will try to find the command on WAPM and install it. If it is not found on WAPM, then the command will not be run and an error will be thrown.

${bold}Finding and installing commands:${reset}

Available commands can be found by searching for them on WAPM ( https://wapm.io ). Anytime a command is run that is not already installed on your machine, it will try to fetch and install the command from WAPM. You may also upload your own ".wasm" files. If they are compiled to WASI, they should work on Webassembly.sh. Feel free to open an issue if your command does not work at: https://github.com/wasmerio/webassembly.sh/issues . To list all installed commands, you may find them using "wasmman list".

${bold}Managing commands:${reset}

To add/remove/list and other functions involving installed commands on your machine, the appropriate command is "wasmman". WasmMan is the Wasm module manager for Webassembly.sh. To see the help and usage for Wasmman, enter "wasmman help".

${bold}Piping a command:${reset}

Command piping is supported by Webassembly.sh. To Redirect the standard output to the standard input of anohter command, you would follow the normal Unix pipe syntax. For example, to pipe cowsay into lolcat, we could enter: "cowsay | lolcat".

${bold}Handling command input:${reset}

Entering input for commands for things like prompt and such, can be done through the terminal for browsers that support SharedArrayBuffer. Otherwise, command input will be handled by the native prompt() UI of the browser.

${bold}Browser Compatibility:${reset}

Webassembly.sh is meant to be run on all modern browsers. However, it is HIGHLY suggested that you use a browser with support for SharedArrayBuffer. This is usually is a Chromium based browser. However, browsers that do NOT support SharedArrayBuffer may be able to run more simple WASI commands without and issue. Where the issues of not having support for SharedArrayBuffer are:

• Infinitely looping commands will freeze the browser.

• Commands that require input will use a less desirable User Experience path.

The reason for this is due to the conflict between I/O and synchronous read/writes required by the WASI API. Thus, to run processes on a seperate thread in a WebWorker and support synchronous I/O requires SharedArrayBuffer. See the Browser Compatibility of @wasmer/wasm-terminal from Wasmer-JS for more information: https://github.com/wasmerio/wasmer-js/tree/master/packages/wasm-terminal#browser-compatibility

`;

export const getMessage = () => message.replace(/\n\n/g, '\n \n');
const help = async () => getMessage();
export default help;
