import * as migration_20250305_160427 from './20250305_160427';

export const migrations = [
  {
    up: migration_20250305_160427.up,
    down: migration_20250305_160427.down,
    name: '20250305_160427'
  },
];
