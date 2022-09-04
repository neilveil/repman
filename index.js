const fs = require('fs')
const path = require('path')
const simpleGit = require('simple-git')
const yaml = require('yaml')
const ajv = require('ajv')

var COUNT_REPOSITORIES = 0 // Total number of repositories
var COUNT_BRANCHES = 0 // Total number of branches
var COUNT_UNTRACKED = 0 // Branch not found in config file
var COUNT_CLONED = 0 // Clone branch if not exists
var COUNT_PENDING = 0 // Code not committed
var COUNT_BEHIND = 0 // Branches not pushed yet
var COUNT_ERROR = 0 // Git error

const tmpDir = 'tmp'

const CONFIG_FILE = process.env.CONFIG_FILE || 'repman.yaml'

console.log(`REPMAN | v1.0.0\n`)

// Check if config file exists
if (!fs.existsSync(CONFIG_FILE)) {
  console.error('Config file not found!')
  process.exit(1)
}

// Load config file
const config = yaml.parse(fs.readFileSync(CONFIG_FILE).toString()) || {}

// Config file schema
const validate = new ajv().compile({
  type: 'object',
  properties: {
    repositories: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            nullable: false,
            minLength: 1
          },
          host: {
            type: 'string',
            nullable: false,
            minLength: 1
          },
          branches: {
            type: 'array',
            minItems: 1,
            uniqueItems: true,
            items: {
              type: 'string',
              minLength: 1
            }
          }
        },
        required: ['name', 'host', 'branches']
      }
    }
  },
  required: ['repositories']
})

// Validate config file
const isValid = validate(config)

if (!isValid) {
  console.error(`"${validate.errors[0].instancePath}": ${validate.errors[0].message}`)
  process.exit(1)
}

const ROOT_DIR = config.root_dir || process.cwd()
const REPOSITORIES = config.repositories || []

const nextSection = '\n---------------\n'

const printStatus = ({ repository, branch, status }) => console.log(`${status}: ${repository}/${branch}`)

const gitHandler = async (action, { repository, host, branch }) => {
  try {
    if (!repository || !host || !branch) throw new Error('Invalid input!')

    const dir = action === 'clone' ? path.join(ROOT_DIR, repository) : path.join(ROOT_DIR, repository, branch)

    fs.mkdirSync(dir, { recursive: true })

    const git = simpleGit(dir)

    switch (action) {
      case 'clone':
        await git.clone(host, branch, {
          '--single-branch': null,
          '--branch': branch
        })
        COUNT_CLONED++
        printStatus({ repository, branch, status: 'CLONED' })
        break

      case 'isPending':
        const isPending = (await git.status()).files.length
        if (isPending) {
          COUNT_PENDING++
          printStatus({ repository, branch, status: 'PENDING' })
        }
        break

      case 'isBehind':
        const branches = Object.values((await git.branch()).branches)

        const currentBranch = branches.find(branch => branch.current === true)
        const remoteBranches = branches.filter(
          branch => branch.name.startsWith('remotes/') && branch.name.endsWith('/' + currentBranch.name)
        )

        if (
          // Code has never been pushed
          !remoteBranches.length ||
          // Last was not pushed
          remoteBranches.find(branch => branch.commit !== currentBranch.commit)
        ) {
          COUNT_BEHIND++
          printStatus({ repository, branch, status: 'BEHIND' })
        }
        break
    }
  } catch (error) {
    COUNT_ERROR++
    printStatus({ repository, branch, status: 'GITERR' })
    console.error(`${error.message}\n`)
  }
}

const main = async () => {
  console.log(`ROOT: ${ROOT_DIR}`)

  console.log(nextSection)

  COUNT_REPOSITORIES = REPOSITORIES.length

  for (const { name: repository, host, branches } of REPOSITORIES) {
    const projectDirPath = path.join(ROOT_DIR, repository)

    fs.mkdirSync(projectDirPath, { recursive: true })

    COUNT_BRANCHES += branches.length

    for (const branch of branches) {
      const branchDirPath = path.join(projectDirPath, branch)

      if (fs.existsSync(branchDirPath)) {
        if (!fs.statSync(branchDirPath).isDirectory()) {
          console.log(`"${branchDirPath}" should be a directory!`)
          process.exit(1)
        }

        await gitHandler('isPending', { repository, branch, host })
        await gitHandler('isBehind', { repository, branch, host })
      } else await gitHandler('clone', { repository, branch, host })
    }

    // Show all unlisted branches
    for (const branch of fs.readdirSync(projectDirPath)) {
      if (!branches.includes(branch) && branch !== tmpDir) {
        COUNT_UNTRACKED++
        printStatus({ repository, branch, status: 'UNTRACKED' })
      }
    }
  }

  const repositoryNames = REPOSITORIES.map(({ name }) => name)

  // Show all unlisted repositories
  for (const repository of fs.readdirSync(ROOT_DIR)) {
    if (fs.statSync(path.join(ROOT_DIR, repository)).isFile()) continue

    if (!repositoryNames.includes(repository) && repository !== CONFIG_FILE && repository !== tmpDir) {
      COUNT_UNTRACKED++
      printStatus({ repository, branch: '--', status: 'UNTRACKED' })
    }
  }

  console.log(nextSection)

  COUNT_UNTRACKED && console.log(`UNTRACKED: ${COUNT_UNTRACKED}`)
  COUNT_ERROR && console.log(`GITERR: ${COUNT_ERROR}`)
  COUNT_CLONED && console.log(`CLONED: ${COUNT_CLONED}`)
  COUNT_PENDING && console.log(`PENDING: ${COUNT_PENDING}`)
  COUNT_BEHIND && console.log(`BEHIND: ${COUNT_BEHIND}`)

  console.log(nextSection)

  !(COUNT_UNTRACKED + COUNT_ERROR + COUNT_CLONED + COUNT_PENDING + COUNT_BEHIND) &&
    console.log(`Everything is in sync!`)

  console.log(`Tracking ${COUNT_BRANCHES} branches from ${COUNT_REPOSITORIES} repositories`)
}

main()
