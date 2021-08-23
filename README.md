neo4jmigrate
============

This is a tool for applying migration scripts to neo4j database.

This tool depends on having the neo4j [cypher-shell](https://neo4j.com/docs/operations-manual/current/tools/cypher-shell/) installed.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/neo4jmigrate.svg)](https://npmjs.org/package/@dayspringpartners/neo4jmigrate)
[![Downloads/week](https://img.shields.io/npm/dw/neo4jmigrate.svg)](https://npmjs.org/package/@dayspringpartners/neo4jmigrate)
[![License](https://img.shields.io/npm/l/neo4jmigrate.svg)](https://github.com/dayspring-tech/neo4jmigrate/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @dayspringpartners/neo4jmigrate
$ nmigrate COMMAND
running command...
$ nmigrate (-v|--version|version)
@dayspringpartners/neo4jmigrate/1.0.1 darwin-x64 node-v14.17.3
$ nmigrate --help [COMMAND]
USAGE
  $ nmigrate COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`nmigrate apply PATH`](#nmigrate-apply-path)
* [`nmigrate help [COMMAND]`](#nmigrate-help-command)
* [`nmigrate status PATH`](#nmigrate-status-path)

## `nmigrate apply PATH`

Apply unapplied migrations from path now.

```
USAGE
  $ nmigrate apply PATH

OPTIONS
  -a, --address=address    [default: bolt://localhost:7687] neo4j host url e.g. bolt://localhost:7687
  -d, --database=database  [default: neo4j] neo4j database name
  -h, --help               show CLI help
  -p, --password=password  (required) neo4j user password
  -u, --username=username  [default: neo4j] neo4j user name
```

_See code: [src/commands/apply.ts](https://github.com/dayspring-tech/neo4jmigrate/blob/v1.0.1/src/commands/apply.ts)_

## `nmigrate help [COMMAND]`

display help for nmigrate

```
USAGE
  $ nmigrate help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.3/src/commands/help.ts)_

## `nmigrate status PATH`

Display the current db migration level.

```
USAGE
  $ nmigrate status PATH

OPTIONS
  -a, --address=address    [default: bolt://localhost:7687] neo4j host url e.g. bolt://localhost:7687
  -d, --database=database  [default: neo4j] neo4j database name
  -h, --help               show CLI help
  -p, --password=password  (required) neo4j user password
  -u, --username=username  [default: neo4j] neo4j user name
```

_See code: [src/commands/status.ts](https://github.com/dayspring-tech/neo4jmigrate/blob/v1.0.1/src/commands/status.ts)_
<!-- commandsstop -->
