const VERSION = "0.0.1";

const help = () => {
  return (
    [
      "",
      "Usage: curl [options] [url]...",
      "",
      "Curl is a simple HTTP client",
      "",
      "Options:",
      "",
      "  -h, --help           output usage information",
      "  -o, --output         Output the contents to a file",
      "  -v, --version        output version number",
      "",
      "Usage:",
      "",
      "# Download file",
      "$ curl https://api.github.com/repos/wasmerio/wasmer/issues?state=closed",
      "",
    ].join("\n  ") + "\n"
  );
};

const firstNonFlag = args => {
  for (var i = 0; i < args.length; i++) {
    if (args[i].charAt(0) != "-") {
      return args[i];
    }
  }
  return "";
};

const cli = async (options, wasmFs) => {
  const argv = options.args.slice(1);

  if (argv.indexOf("--help") !== -1 || argv.indexOf("-h") !== -1) {
    return help();
  } else if (argv.indexOf("--version") !== -1 || argv.indexOf("-v") !== -1) {
    return VERSION;
  } else if (argv.length) {
    var destinationIndex =
      argv.indexOf("--output") + argv.indexOf("-o") + 2;

    var args = {};
    if (destinationIndex) {
      args.output = argv[destinationIndex];
      argv.splice(destinationIndex - 1, 2);
    }
    args.url = firstNonFlag(argv);
    if (args.url.length > 0) {
      return await curl(args, wasmFs);
    } else {
      return help();
    }
  } else {
    return help();
  }
};

const curl = async ({url, output}, wasmFs) => {
    const response = await fetch(url, {credentials: 'omit'});
    const responseArray = await response.arrayBuffer();
    let view = new Uint8Array(responseArray); // treat buffer as a sequence of 32-bit integers
    if (!output) {
        output = "/dev/stdout"
    }
    wasmFs.fs.writeFileSync(
        output,
        view
    );
};

export default cli;
