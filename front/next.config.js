//const withBundleAnalizer = require('@zeit/next-bundle-analyzer')
const withBundleAnalizer = require('@next/bundle-analyzer')
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = withBundleAnalizer({
    enabled: process.env.ANALYZE === 'true',
    distDir: '.next',
    webpack: (config) => {
        const prod = process.env.NODE_ENV === 'production';
        const plugins = [...config.plugins];
        if(prod){
            plugins.push(new CompressionPlugin())
        }
        return {
            ...config,
            mode: prod? 'production': 'development',
            devtool: prod? 'hidden-source-map': 'eval', 
            plugins,
        }
    }
})

//before making product of my app, need to custom webpack or babel that setted in the first place by NEXT
//this next.config.js file is custom config file.
//in order to custom this file, you should analyze the entire files to find out what's the problem especially the size of files