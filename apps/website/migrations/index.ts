import * as migration_20250727_233802 from './20250727_233802';
import * as migration_20250728_225702 from './20250728_225702';

export const migrations = [
  {
    up: migration_20250727_233802.up,
    down: migration_20250727_233802.down,
    name: '20250727_233802',
  },
  {
    up: migration_20250728_225702.up,
    down: migration_20250728_225702.down,
    name: '20250728_225702'
  },
];
