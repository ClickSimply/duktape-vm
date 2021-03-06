const path = require('path');
const webpack = require("webpack");

module.exports = (env) => {
    env = env || {};
    return {
        entry: {
            "duktape-vm": [path.join(__dirname, 'src', 'index.ts')]
        },
        output: {
            path: path.join(__dirname, 'build'),
            filename: env.target === "node" ? '[name].js' : (env.asm ? '[name].min.asm.js' : (env.both ? '[name].min.both.js' : '[name].min.js')),
            libraryTarget: env.target === "node" ? 'commonjs2' : 'umd',
            umdNamedDefine: true
        },
        // target: env.target || "web",
        resolve: {
            extensions: ['.ts', '.js', ".c", ".cpp"]
        },
        devServer: {
            historyApiFallback: true,
            inline: false,
            contentBase: "build",
        },
        watchOptions: {
            aggregateTimeout: 500,
        },
        node: {
            global: false
        },
        optimization: {
            minimize: env.target === "node" ? false : true
        },
        module: {
            rules: [{
                    test: /\.ts$/,
                    loader: 'ts-loader'
                },
                {
                    test: /\.(c|cpp)$/,
                    use: {
                        loader: 'cpp-wasm-loader',
                        options: {
                            emccFlags: (existingFlags) => existingFlags.concat(["-DEMSCRIPTEN", "-s", "EXTRA_EXPORTED_RUNTIME_METHODS=['ccall', 'cwrap']"]), // add or modify compiler flags
                            // emccPath: "path/to/emcc", // only needed if emcc is not in PATH,
                            memoryClass: false, // disable javascript memory management class,
                            // fetchFiles: true,
                            asmJs: env.asm || env.both ? true : false,
                            wasm: env.asm ? false : true,
                            fullEnv: true
                        }
                    }
                }
            ]
        }
    }
};