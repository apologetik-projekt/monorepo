import * as migration_20250305_160427 from './20250305_160427';
import * as migration_20250316_235221 from './20250316_235221';
import * as migration_20250327_174959 from './20250327_174959';

export const migrations = [
  {
    up: migration_20250305_160427.up,
    down: migration_20250305_160427.down,
    name: '20250305_160427',
  },
  {
    up: migration_20250316_235221.up,
    down: migration_20250316_235221.down,
    name: '20250316_235221',
  },
  {
    up: migration_20250327_174959.up,
    down: migration_20250327_174959.down,
    name: '20250327_174959'
  },
];
