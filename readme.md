# Repman

CLI based multiple git repository tracking & management tool.

## Installation

Linux

```bash
wget https://neilveil.github.io/repman/bin/linux.bin -O /usr/bin/repman
```

MacOS

```bash
wget https://neilveil.github.io/repman/bin/windows.exe -O C:\Windows\repman
```

```powershell
wget https://neilveil.github.io/repman/bin/macos.bin -O /usr/bin/repman
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
