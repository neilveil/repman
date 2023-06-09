# Repman

## Installation

Linux

```bash
wget http://s3.amazonaws.com/joahquin/repman/v1.0.0/linux -O /usr/bin/repman
```

MacOS

```bash
wget http://s3.amazonaws.com/joahquin/repman/v1.0.0/macos -O /usr/bin/repman
```

```powershell
wget http://s3.amazonaws.com/joahquin/repman/v1.0.0/windows.exe -O C:\Windows\repman
```

## Usage

Add a configuration file with name `repman.yaml` & run command `repman`. Voila!

## Configuration file

```yaml
root_dir: ./example

repositories:
  - name: dummy-repository-1
    host: git@github.com:neilveil/dummy-repository-1.git
    branch: main

  - name: dummy-repository-2
    host: git@github.com:neilveil/dummy-repository-2.git
    branch: main
```
