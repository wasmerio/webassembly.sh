import {reset, magenta, bold, underline, boldAndUnderline} from '../../../util/ansi';

const message = `RUNNING A COMMAND:
    To run a command, type the command name, and then press enter.
    For example, if we wanted to run the command "cowsay", and pass the argument "hello", we would type "cowsay hello", and then press the enter key.
    If the command ("cowsay") is already installed, meaning it was uploaded by you, or downloaded from WAPM ( https://wapm.io ) then it will run immediately.
    If the command is not installed on your machine, Webassembly.sh will try to find the command on WAPM and install it.
    If it is not found on WAPM, then the command will not be run and an error will be thrown.

FINDING AND INSTALLING COMMANDS:
    Available commands can be found by searching for them on WAPM - https://wapm.io.
    Anytime a command is run that is not already installed on your machine, it will try to fetch and install the command from WAPM.
    You may also upload your own ".wasm" files. If they are compiled to WASI, they should work on Webassembly.sh.
    
    Feel free to open an issue if your command does not work at:
    https://github.com/wasmerio/webassembly.sh/issues
    
    To list all installed commands, you may find them using "wapm list".

MANAGING COMMANDS:
    To add/remove/list and other functions involving installed commands on your machine, the appropriate command is "wapm". wapm is the Wasm module manager for Webassembly.sh.
    To see the help and usage for wapm, enter "wapm help".

USING PIPES:
    Command piping is supported by Webassembly.sh.
    To Redirect the standard output to the standard input of another command, you would follow the normal Unix pipe syntax.
    
    For example, to pipe cowsay into lolcat, we could enter:
        cowsay hello | lolcat

COMMAND INPUT:
    Entering input for commands for things like prompt and such, can be done through the terminal for browsers that support SharedArrayBuffer.
    Otherwise, command input will be handled by the native prompt() UI of the browser.`;

export const getMessage = () => message.replace(/\n\n/g, '\n \n');
const help = async () => getMessage();
export default help;
