// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

module.exports = (async () => {
  const config = await getDefaultConfig(__dirname);

  // allow .wasm files to be bundled
  config.resolver.assetExts.push('wasm');

  // Also might need to avoid treating wasm as source files
  // config.resolver.sourceExts.push('wasm');

  return config;
})();
