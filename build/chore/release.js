/**
 * @file WIP 仅供测试使用
 * 
 * 相关依赖只安装到了本地，没有放到 package.json 中
 */

const chalk = require('chalk')

const { check, cmd } = require('./utils')

const args = process.argv.slice(2) || []
let [targetBranch, forcePush] = args

check(async function () {

  const curBranch = (await cmd('git rev-parse --abbrev-ref HEAD')).trim()

  // 暂存区暂时没处理，所以如果分支不干净会迁出失败
  console.log('targetBranch: ', targetBranch)

  console.log(`sync branch ${curBranch} with origin...`)
  await cmd(`git pull origin ${curBranch}`)
  await cmd(`git push origin ${curBranch}`)

  return

  // 注意，如果分支不存在于本地，则会迁出失败
  console.log(`checking out...`)
  await cmd(`git checkout ${targetBranch}`)

  console.log(`merging ${targetBranch} with ${curBranch}...`)
  await cmd(`git merge ${curBranch} --no-ff -m "merge: ${curBranch}"`)

  console.log(`sync branch ${targetBranch} with origin...`)
  await cmd(`git pull origin ${targetBranch}`)
  // if (forcePush) {}
  await cmd(`git push origin ${targetBranch}`)

  console.log(`checking back...`)
  await cmd(`git checkout ${curBranch}`)

  console.log(chalk.green(`[Release Done]`))

})
