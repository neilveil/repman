const fs = require('fs')
const path = require('path')
const simpleGit = require('simple-git')
const yaml = require('yaml')
const ajv = require('ajv')

var COUNT_UNTRACKED = 0 // Branch not found in config file
var COUNT_CLONED = 0 // Clone branch if not exists
var COUNT_PENDING = 0 // Code not committed
var COUNT_BEHIND = 0 // Branches not pushed yet
var COUNT_ERROR = 0 // Git error

const tmpDir = 'tmp'

const CONFIG_FILE = process.env.CONFIG_FILE || 'repman.yaml'

console.log(`REPMAN | v2.0.0\n`)

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
          branch: {
            type: 'string',
            nullable: false,
            minLength: 1
          }
        },
        required: ['name', 'host', 'branch']
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

if (!fs.existsSync(ROOT_DIR)) fs.mkdirSync(ROOT_DIR, { recursive: true })
else if (fs.statSync(ROOT_DIR).isFile()) throw new Error('A file with root directory name exists!')

const nextSection = '\n---------------\n'

const printStatus = (name, status) => console.log(`${name} -> ${status}`)

const gitHandler = async (action, { name, host, branch }) => {
  try {
    if (!name || !host || !branch) throw new Error('Invalid input!')

    var git, branches, currentBranch

    if (action === 'clone') git = simpleGit(ROOT_DIR)
    else {
      git = simpleGit(path.join(ROOT_DIR, name))

      branches = Object.values((await git.branch()).branches)
      currentBranch = branches.find(branch => branch.current === true)
    }

    switch (action) {
      case 'clone':
        await git.clone(host, name, {
          '--single-branch': null,
          '--branch': branch
        })
        COUNT_CLONED++
        printStatus(name, 'cloned')
        break

      case 'isTracked':
        if (currentBranch.name === branch) return true
        else return false

      case 'isPending':
        const isPending = (await git.status()).files.length
        if (isPending) {
          COUNT_PENDING++
          printStatus(name, 'pending')
        }
        break

      case 'isBehind':
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
          printStatus(name, 'behind')
        }
        break
    }
  } catch (error) {
    COUNT_ERROR++
    printStatus(name, 'error')
    console.error(`${error.message}\n`)
  }
}

//
// Main
//

const main = async () => {
  console.log(`ROOT_DIR: ${ROOT_DIR}`)

  console.log(nextSection)

  for (const { name, host, branch } of REPOSITORIES) {
    const projectPath = path.join(ROOT_DIR, name)

    if (fs.existsSync(projectPath)) {
      if (!fs.statSync(projectPath).isDirectory()) {
        console.log(`"${projectPath}" should be a directory!`)
        process.exit(1)
      }

      if (await gitHandler('isTracked', { name, branch, host })) {
        await gitHandler('isPending', { name, branch, host })
        await gitHandler('isBehind', { name, branch, host })
      } else {
        printStatus(name, 'error')
        console.error('Untracked branch checked out!')
      }
    } else await gitHandler('clone', { name, branch, host })
  }

  const repositoryNames = REPOSITORIES.map(({ name }) => name)

  // Show all unlisted repositories
  for (const repository of fs.readdirSync(ROOT_DIR)) {
    // Untracked files & directories
    if (!repositoryNames.includes(repository) && repository !== CONFIG_FILE && repository !== tmpDir) {
      COUNT_UNTRACKED++
      printStatus(repository, 'untracked')
    }
  }

  console.log(nextSection)

  COUNT_UNTRACKED && console.log(`Untracked: ${COUNT_UNTRACKED}`)
  COUNT_ERROR && console.log(`Errors: ${COUNT_ERROR}`)
  COUNT_CLONED && console.log(`Cloned: ${COUNT_CLONED}`)
  COUNT_PENDING && console.log(`Pending: ${COUNT_PENDING}`)
  COUNT_BEHIND && console.log(`Behind: ${COUNT_BEHIND}`)

  console.log(nextSection)

  !(COUNT_UNTRACKED + COUNT_ERROR + COUNT_CLONED + COUNT_PENDING + COUNT_BEHIND) &&
    console.log(`Everything is in sync!`)

  console.log(`Tracking ${REPOSITORIES.length} projects!`)
}

main()
