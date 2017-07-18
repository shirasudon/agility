const fb = require("fuse-box");
const fuseBox = new fb.FuseBox({
    homeDir: "src/client",
    output: "dist/$name.js",
    plugins: [
        fb.BabelPlugin(),
    ],
});

fuseBox.bundle("bundle")
    .instructions(`>index.jsx`);

fuseBox.run();
