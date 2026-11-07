import * as migration_20261107_102000_foundation from './20261107_102000_foundation';
import * as migration_20261107_102100_last_admin_guard from './20261107_102100_last_admin_guard';

export const migrations = [
  // Migration order is append-only.
  {
    up: migration_20261107_102000_foundation.up,
    down: migration_20261107_102000_foundation.down,
    name: '20261107_102000_foundation'
  },
  {
    up: migration_20261107_102100_last_admin_guard.up,
    down: migration_20261107_102100_last_admin_guard.down,
    name: '20261107_102100_last_admin_guard'
  },
];
