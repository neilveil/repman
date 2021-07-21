const fs = require('fs')
const path = require('path')
const simpleGit = require('simple-git')
const yaml = require('yaml')

var COUNT_REPOSITORIES = 0 // Total number of repositories
var COUNT_BRANCHES = 0 // Total number of branches
var COUNT_UNTRACKED = 0 // Branch not found in config file
var COUNT_GITERR = 0 // Git error
var COUNT_CLONED = 0 // Clone branch if not exists
var COUNT_PENDING = 0 // Code not committed
var COUNT_BEHIND = 0 // Branches not pushed yet

const AG_CONFIG = process.env.AG_CONFIG || 'auto-git.yml'

if (!fs.existsSync(AG_CONFIG)) {
  console.error('Config file not found!')
  process.exit(1)
}

const config = yaml.parse(fs.readFileSync(AG_CONFIG).toString()) || {}

const ROOT_DIR = config.root_dir || process.cwd()
const DEFAULT_BRANCH = config.default_branch || 'master'
const REPOSITORIES = config.repositories || []

const printStatus = ({ repository, branch, status }) =>
  console.log(`${status}: ${repository}/${branch}`)

const callAction = async (action, { repository, host, branch }) => {
  try {
    if (!repository || !host || !branch)
      throw new Error('Invalid clone config!')

    const dir =
      action !== 'clone'
        ? path.join(ROOT_DIR, repository, branch)
        : path.join(ROOT_DIR, repository)

    fs.mkdirSync(dir, { recursive: true })

    const git = simpleGit(dir)

    switch (action) {
      case 'clone':
        await git.clone(host, path.join(dir, branch), {
          '--single-branch': null,
          '--branch': branch,
        })
        COUNT_CLONED++
        printStatus({ repository, branch, status: 'CLONED' })
        return

      case 'isPending':
        const isPending = (await git.status()).files.length
        if (isPending) {
          COUNT_PENDING++
          printStatus({ repository, branch, status: 'PENDING' })
          return true
        } else return false

      case 'isBehind':
        const branches = Object.values((await git.branch()).branches)

        const currentBranch = branches.find((branch) => branch.current === true)
        const remoteBranches = branches.filter(
          (branch) =>
            branch.name.startsWith('remotes/') &&
            branch.name.endsWith('/' + currentBranch.name)
        )

        if (
          // Code has never been pushed
          !remoteBranches.length ||
          // Last was not pushed
          remoteBranches.find(
            (branch) => branch.commit !== currentBranch.commit
          )
        ) {
          COUNT_BEHIND++
          printStatus({ repository, branch, status: 'BEHIND' })
        }
    }
  } catch (error) {
    COUNT_GITERR++
    printStatus({ repository, branch, status: 'GITERR' })
    console.error(`${error.message}\n`)
  }
}

;(async () => {
  console.log(`ROOT: ${ROOT_DIR}\n`)

  for (const repository in REPOSITORIES) {
    COUNT_REPOSITORIES++

    const projectDirPath = path.join(ROOT_DIR, repository)

    fs.mkdirSync(projectDirPath, { recursive: true })

    // Handle direct host assignment
    if (typeof REPOSITORIES[repository] === 'string')
      REPOSITORIES[repository] = {
        host: REPOSITORIES[repository],
        branches: [DEFAULT_BRANCH],
      }

    const { host, branches } = REPOSITORIES[repository]

    for (const branch of branches) {
      COUNT_BRANCHES++

      const branchDirPath = path.join(projectDirPath, branch)

      if (fs.existsSync(branchDirPath)) {
        if (!(await callAction('isPending', { repository, branch, host })))
          await callAction('isBehind', { repository, branch, host })
      } else await callAction('clone', { repository, branch, host })
    }

    // Show all unlisted branches
    for (const branch of fs.readdirSync(projectDirPath)) {
      if (!branches.includes(branch)) {
        COUNT_UNTRACKED++
        printStatus({ repository, branch, status: 'UNTRACKED' })
      }
    }
  }

  // Show all unlisted repositories
  for (const repository of fs.readdirSync(ROOT_DIR)) {
    if (!REPOSITORIES.includes(repository)) {
      COUNT_UNTRACKED++
      printStatus({ repository, branch: '--', status: 'UNTRACKED' })
    }
  }

  console.log()

  COUNT_UNTRACKED && console.log(`UNTRACKED: ${COUNT_UNTRACKED}`)
  COUNT_GITERR && console.log(`GITERR: ${COUNT_GITERR}`)
  COUNT_CLONED && console.log(`CLONED: ${COUNT_CLONED}`)
  COUNT_PENDING && console.log(`PENDING: ${COUNT_PENDING}`)
  COUNT_BEHIND && console.log(`BEHIND: ${COUNT_BEHIND}`)

  !(
    COUNT_UNTRACKED +
    COUNT_GITERR +
    COUNT_CLONED +
    COUNT_PENDING +
    COUNT_BEHIND
  ) && console.log(`Everything is in sync!`)

  console.log()

  console.log(
    `Tracking ${COUNT_BRANCHES} branches & ${COUNT_REPOSITORIES} repositories`
  )
})()
