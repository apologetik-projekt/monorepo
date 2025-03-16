import * as migration_20250305_160427 from './20250305_160427';
import * as migration_20250316_235221 from './20250316_235221';

export const migrations = [
  {
    up: migration_20250305_160427.up,
    down: migration_20250305_160427.down,
    name: '20250305_160427',
  },
  {
    up: migration_20250316_235221.up,
    down: migration_20250316_235221.down,
    name: '20250316_235221'
  },
];
