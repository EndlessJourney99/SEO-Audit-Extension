import type { Config } from '@jest/types';
// Sync object
const config: Config.InitialOptions = {
    verbose: true,
    testPathIgnorePatterns: ['/Resources'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
};

export default config;
