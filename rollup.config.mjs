import resolve from "@rollup/plugin-node-resolve";

export default {
  input: "src/App.js",
  output: [
    {
      format: "esm",
      file: "src/bundle.js",
    },
  ],
  plugins: [resolve()],
};

//BUILD SCRIPT: rollup -c ./rollup.config.mjs
