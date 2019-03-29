const {defaults: tsjPreset} = require('ts-jest/presets');

module.exports = {
    globals: {
        "ts-jest": []
    },
    transform: {
        ...tsjPreset.transform,
    },
    moduleFileExtensions: [
        "ts",
        "tsx",
        "js"
    ],
    collectCoverage: true,
    collectCoverageFrom: [
        "src/ts/**/*.ts",
        "!src/ts/**/*.d.ts",
        "!src/ts/index.ts",
    ],
};