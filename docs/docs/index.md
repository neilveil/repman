# Docs

Add repman configuration file with name `repman.yaml` & run command `repman`. Voila!

## Configuration File

Add `repman.yaml` file.

```yaml:no-line-numbers
repositories:
  - name: my-repo-1
    host: git@github.com:neilveil/repman.git
    branch: master

  - name: my-repo-2
    host: git@github.com:neilveil/repman.git
    branch: master
```

## Run Repman

Run `repman` command from `repman.yaml` file directory.

```sh:no-line-numbers
repman
```

File structure

```txt:no-line-numbers
- /my-repos
  - repman.yaml
  - /my-repo-1
  - /my-repo-2
```

## Root directory

File structure

```txt:no-line-numbers
- /my-repos-collection-1
- /my-repos-collection-2
- /repman-configs
  - repman-1.yaml
  - repman-2.yaml
```

`/repman-configs/repman-1.yaml`

```yaml:no-line-numbers
root_dir: ./my-repos-collection-1

repositories:
  - name: my-repo-1
    host: git@github.com:neilveil/repman.git
    branch: master

  - name: my-repo-2
    host: git@github.com:neilveil/repman.git
    branch: master
```

Run `repman-1.yaml` from `/repman-configs` directory

```sh:no-line-numbers
REPMAN_CONFIG_FILE=repman-1.yaml repman
```
