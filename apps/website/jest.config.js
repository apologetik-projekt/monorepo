export default {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'] }],
  },
  moduleNameMapper: {
    // Handle CSS imports (if any)
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    // Handle image imports
    '\\.(gif|ttf|eot|svg|png|jpg|jpeg|webp)$': '<rootDir>/__mocks__/fileMock.js',
    // Handle module aliases (if you have them in tsconfig.json)
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/app/(.*)$': '<rootDir>/src/app/$1',
    // Needed for @visx/xychart
    // Adjusted paths from ../../node_modules to <rootDir>/node_modules
    'd3-shape': '<rootDir>/node_modules/d3-shape/dist/d3-shape.min.js', 
    'd3-path': '<rootDir>/node_modules/d3-path/dist/d3-path.min.js',
    'd3-array': '<rootDir>/node_modules/d3-array/dist/d3-array.min.js',
    'd3-time': '<rootDir>/node_modules/d3-time/dist/d3-time.min.js',
    'd3-format': '<rootDir>/node_modules/d3-format/dist/d3-format.min.js',
    'd3-interpolate': '<rootDir>/node_modules/d3-interpolate/dist/d3-interpolate.min.js',
    'd3-time-format': '<rootDir>/node_modules/d3-time-format/dist/d3-time-format.min.js',
    'd3-scale': '<rootDir>/node_modules/d3-scale/dist/d3-scale.min.js',

  },
  // Updated testPathIgnorePatterns to be transformIgnorePatterns and whitelist d3-*, @visx, @react-spring and other common ESM dependencies
  transformIgnorePatterns: [
    "/node_modules/(?!(d3-.*|@visx|internmap|delaunator|robust-predicates|@react-spring)/)",
    "\\.pnp\\.[^\\/]+$"
  ],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/migrations/*',
    '!src/**/payload-types.ts',
    '!src/payload.config.ts',
    '!src/app/(api)/**/*', // Exclude API routes or similar
  ],
  // Automatically clear mock calls and instances between every test
  clearMocks: true,
};
