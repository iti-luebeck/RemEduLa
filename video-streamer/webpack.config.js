const webpack = require('webpack');
const path = require('path');


/** @type {webpack.Configuration} */
const baseConfig = {
    module: {
        rules: [ { test: /\.tsx?$/, use: 'ts-loader', exclude: /node_modules/ },],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    devtool: false,
    devtool: 'eval',
    mode: 'development',
    // cache: {
    //     type: 'filesystem',
    //     allowCollectingMemory: true,
    // },
};

/** @type {webpack.Configuration} */
const videoStreamerConfig = {
    ...baseConfig,
    target: 'node',
    entry: './src/ts/video-streamer/index.ts',
    output: {
        filename: 'videoStreamer.js',
        path: path.resolve(__dirname, 'build')
    }
};

module.exports = [
    videoStreamerConfig
];
