# NIST DADS for Shell

Show a random tip from NIST DADS (https://xlinux.nist.gov/dads) every time you open your terminal

### Usage

```sh
./bin/nistdads tip
```

### PowerShell Setup Guide

0. Add the `nistdads.exe` to your system PATH
1. Start and edit the profile file:

```powershell
code $Profile.AllUsersAllHosts
```

2. Add the following line:

```
nistdads tip
```