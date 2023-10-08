const webpack = require("webpack");

module.exports = function override(config) {
  const fallback = config.resolve.fallback || {};

  Object.assign(fallback, {
    stream: require.resolve("stream-browserify"),
    http: require.resolve("stream-http"),
    https: require.resolve("https-browserify"),
    os: require.resolve("os-browserify"),
    path: require.resolve("path-browserify"),
    url: require.resolve("url"),
    querystring: require.resolve("querystring-es3"),
    util: require.resolve("util"),
    crypto: require.resolve("crypto-browserify"),
    zlib: require.resolve("browserify-zlib"),
    process: require.resolve("process"),
    assert: require.resolve("assert"),
    net: false, 
    fs: false,
    
    child_process: false,
    tls: false,
  });

  config.resolve.fallback = fallback;
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    }),
  ]);
  config.resolve.extensions.push(".mjs");
  config.module.rules.push({
    test: /\.m?js/,
    resolve: {
      fullySpecified: false,
    },
  });

  return config;
};