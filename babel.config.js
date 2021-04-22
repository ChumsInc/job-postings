const presets = [
    "@babel/preset-env",
    "@babel/preset-react",
    "@babel/preset-typescript"
];

const plugins = [
    ["@babel/plugin-proposal-class-properties", { "loose": true }]
];


module.exports = {
    presets,
    plugins,
};
