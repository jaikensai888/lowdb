var fs = require('fs')
var path = require('path')
var _ = require('lodash')
var steno = require('steno')

function getTempFile(file) {
  return path.join(
    path.dirname(file),
    '.~' + path.basename(file)
  )
}

module.exports = {
  read: function (file) {
    if (fs.existsSync(file)) {
      var buf = fs.readFileSync(file)
      return buf ? buf.toString().trim() : ''
    }
  },

  write: function(file, data) {
    steno(getTempFile(file))
      .setCallback(function(err, data, next) {
        if (err) throw err
        fs.rename(getTempFile(file), file, function(err) {
          if (err) throw err
          next()
        })
      })
      .write(data)
  },

  writeSync: function(file, data) {
    fs.writeFileSync(getTempFile(file), data)
    fs.renameSync(getTempFile(file), file)
  }
}
