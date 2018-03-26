/*!
 * migrate
 * Copyright(c) 2011 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

let MigrationSet = require('./lib/set')
let FileStore = require('./lib/file-store')
let loadMigrationsIntoSet = require('./lib/load-migrations')

/**
 * Expose the migrate function.
 */

exports = module.exports = migrate

function migrate (title, up, down) {
  // migration
  if (typeof title === 'string' && up && down) {
    migrate.set.addMigration(title, up, down)
  // specify migration file
  } else if (typeof title === 'string') {
    migrate.set = exports.load(title)
  // no migration path
  } else if (!migrate.set) {
    throw new Error('must invoke migrate(path) before running migrations')
  // run migrations
  } else {
    return migrate.set
  }
}

/**
 * Expose MigrationSet
 */
exports.MigrationSet = MigrationSet

exports.load = async function (options) {
  let opts = options || {}

  // Create default store
  let store = (typeof opts.stateStore === 'string') ? new FileStore(opts.stateStore) : opts.stateStore

  // Create migration set
  let set = new MigrationSet(store)

  await loadMigrationsIntoSet({
    set: set,
    store: store,
    migrationsDirectory: opts.migrationsDirectory,
    filterFunction: opts.filterFunction,
    sortFunction: opts.sortFunction
  })
  return set
}
