const chalk = require('chalk')
const exec = require('child_process').exec

const check = async function (fn) {
  try {
    const valid = await fn()
    if (valid instanceof Error) {
      console.error(chalk.red(String(valid)))
      process.exit(1)
    }
  } catch (error) {
    console.error(chalk.red(String(error)))
    process.exit(1)
  }
}

const cmd = function (command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout) => {
      console.log(error, stdout)
      if (error) {
        return reject(error)
      }
      return resolve(stdout || '')
    })
  }).catch(error => {
    console.error(error)
  })
}

const line = function () {
  console && console.log && console.log()
}

module.exports = {
  check,
  cmd,
  line,
}
