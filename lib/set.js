/*!
 * migrate - Set
 * Copyright (c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

let EventEmitter = require('events')
let Migration = require('./migration')
let migrate = require('./migrate')
let inherits = require('inherits')

/**
 * Expose `Set`.
 */

module.exports = MigrationSet

/**
 * Initialize a new migration `Set` with the given `path`
 * which is used to store data between migrations.
 *
 * @param {String} path
 * @api private
 */

function MigrationSet (store) {
  this.store = store
  this.migrations = []
  this.map = {}
  this.lastRun = null
};

/**
 * Inherit from `EventEmitter.prototype`.
 */

inherits(MigrationSet, EventEmitter)

/**
 * Add a migration.
 *
 * @param {String} title
 * @param {Function} up
 * @param {Function} down
 * @api public
 */

MigrationSet.prototype.addMigration = function (title, up, down) {
  let migration
  if (!(title instanceof Migration)) {
    migration = new Migration(title, up, down)
  } else {
    migration = title
  }

  // Only add the migration once, but update
  if (this.map[migration.title]) {
    this.map[migration.title].up = migration.up
    this.map[migration.title].down = migration.down
    this.map[migration.title].description = migration.description
    return
  }

  this.migrations.push(migration)
  this.map[migration.title] = migration
}

/**
 * Save the migration data.
 *
 * @api public
 */

MigrationSet.prototype.save = async function () {
  await this.store.save(this)
  this.emit('save')
}

/**
 * Run down migrations and call `fn(err)`.
 *
 * @param {Function} fn
 * @api public
 */

MigrationSet.prototype.down = async function (context, migrationName) {
  return this.migrate('down', context, migrationName)
}

/**
 * Run up migrations and call `fn(err)`.
 *
 * @param {Function} fn
 * @api public
 */

MigrationSet.prototype.up = async function (context, migrationName) {
  return this.migrate('up', context, migrationName)
}

/**
 * Migrate in the given `direction`, calling `fn(err)`.
 *
 * @param {String} direction
 * @param {Function} fn
 * @api public
 */

MigrationSet.prototype.migrate = async function (direction, context, migrationName) {
  if (typeof context === 'string') {
    migrationName = context
    context = {}
  }
  return migrate(this, direction, context, migrationName)
}
