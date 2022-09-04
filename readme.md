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
# Optional, default is current directory
# root_dir: /home/ubuntu/repositories

repositories:
  - name: my-app-1
    host: git@github.com:dummy-user/my-app-1.git
    branches:
      - main
      - api-server
      - react-app

  - name: my-app-2
    host: git@github.com:dummy-user/my-app-2.git
    branches:
      - android-app
      - ios-app
```
