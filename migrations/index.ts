import * as migration_20261107_102000_foundation from './20261107_102000_foundation';
import * as migration_20261107_102100_last_admin_guard from './20261107_102100_last_admin_guard';
import * as migration_20261114_120000_initial_password from './20261114_120000_initial_password';
import * as migration_20261114_174542_company_settings_and_page_seo from './20261114_174542_company_settings_and_page_seo';
import * as migration_20261114_191532_blog_posts_and_categories from './20261114_191532_blog_posts_and_categories';
import * as migration_20261114_201626_careers from './20261114_201626_careers';
import * as migration_20261115_085557 from './20261115_085557';

export const migrations = [
  {
    up: migration_20261107_102000_foundation.up,
    down: migration_20261107_102000_foundation.down,
    name: '20261107_102000_foundation',
  },
  {
    up: migration_20261107_102100_last_admin_guard.up,
    down: migration_20261107_102100_last_admin_guard.down,
    name: '20261107_102100_last_admin_guard',
  },
  {
    up: migration_20261114_120000_initial_password.up,
    down: migration_20261114_120000_initial_password.down,
    name: '20261114_120000_initial_password',
  },
  {
    up: migration_20261114_174542_company_settings_and_page_seo.up,
    down: migration_20261114_174542_company_settings_and_page_seo.down,
    name: '20261114_174542_company_settings_and_page_seo',
  },
  {
    up: migration_20261114_191532_blog_posts_and_categories.up,
    down: migration_20261114_191532_blog_posts_and_categories.down,
    name: '20261114_191532_blog_posts_and_categories',
  },
  {
    up: migration_20261114_201626_careers.up,
    down: migration_20261114_201626_careers.down,
    name: '20261114_201626_careers',
  },
  {
    up: migration_20261115_085557.up,
    down: migration_20261115_085557.down,
    name: '20261115_085557'
  },
];
