let formatDate = require('dateformat')
let fs = require('fs')
let mkdirp = require('mkdirp-promise')
let path = require('path')
let slug = require('slug')
let util = require('util')

let writeFileAsync = util.promisify(fs.writeFile)
let readFileAsync = util.promisify(fs.readFile)

module.exports = async function templateGenerator (opts, cb) {
  // Setup default options
  opts = opts || {}
  let name = opts.name
  let dateFormat = opts.dateFormat
  let templateFile = opts.templateFile || path.join(__dirname, 'template.js')
  let migrationsDirectory = opts.migrationsDirectory || 'migrations'
  let extention = opts.extention || '.js'

  let template = await loadTemplate(templateFile)
    // Ensure migrations directory exists
  await mkdirp(migrationsDirectory)

  // Create date string
  let formattedDate = dateFormat ? formatDate(new Date(), dateFormat) : Date.now()

  // Fix up file path
  let p = path.join(
      process.cwd(),
      migrationsDirectory,
      slug(formattedDate + (name ? '-' + name : '')) + extention)

  // Write the template file
  await writeFileAsync(p, template)
  return p
}

let _templateCache = {}
async function loadTemplate (tmpl) {
  if (_templateCache[tmpl]) {
    return _templateCache
  }
  let content = await readFileAsync(tmpl, {
    encoding: 'utf8'
  })
  _templateCache[tmpl] = content
  return content
}
