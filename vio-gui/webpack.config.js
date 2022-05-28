const webpack = require('webpack');
const path = require('path');

const CopyPlugin = require('copy-webpack-plugin');
const DEFS = require('./webpack.defs');


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
const serverConfig = {
    ...baseConfig,
    target: 'node',
    entry: './src/ts/backend/index.ts',
    externals: {
        // '@serialport/bindings': {
        //   commonjs: '@serialport/bindings',
        // }
        'serialport': `require('serialport')`
    },
    plugins: [
        new webpack.DefinePlugin(DEFS),
        new CopyPlugin({patterns: [
            { from: 'src/config', to: '.' }
        ]}),
    ],
    output: {
        filename: 'viogui.js',
        path: path.resolve(__dirname, 'build')
    }
};

/** @type {webpack.Configuration} */
const clientConfig = {
    ...baseConfig,
    target: 'web', 
    entry: './src/ts/frontend/index.ts',
    plugins: [
        new webpack.DefinePlugin(DEFS),
        new CopyPlugin({patterns: [{
            from: 'src/public',
            to: './public'
        }]})
    ],
    output: {
        filename: './public/js/script.js',
        path: path.resolve(__dirname, 'build'),
        // clean: true
    }
};

module.exports = [
    serverConfig, 
    clientConfig
];
