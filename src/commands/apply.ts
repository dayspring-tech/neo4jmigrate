import { Command, flags } from '@oclif/command';
import { getMigrationList, Migration } from '../migrations';
import { Neo4jConfig, Neo4JService } from '../neo4j';
import { execp, serial } from '../utils';

export default class Apply extends Command {
  static description = 'Apply unapplied migrations from path now.';

  static flags = {
    help: flags.help({ char: 'h' }),
    address: flags.string({
      char: 'a',
      description: 'neo4j host url e.g. bolt://localhost:7687',
      env: 'NEO4J_ADDRESS',
      required: false,
      default: 'bolt://localhost:7687',
    }),
    username: flags.string({
      char: 'u',
      description: 'neo4j user name',
      env: 'NEO4J_USER',
      required: false,
      default: 'neo4j',
    }),
    password: flags.string({
      char: 'p',
      description: 'neo4j user password',
      env: 'NEO4J_PASSWORD',
      required: true,
    }),
    database: flags.string({
      char: 'd',
      description: 'neo4j database name',
      env: 'NEO4J_DATABASE',
      required: false,
      default: 'neo4j',
    }),
  };

  static args = [
    {
      name: 'path',
      required: true,
    },
  ];

  async run() {
    const { args, flags } = this.parse(Apply);

    const neo4jConfig = {
      url: flags.address,
      username: flags.username,
      password: flags.password,
      database: flags.database,
    };
    const path = args.path;

    const neo4j = new Neo4JService(neo4jConfig);
    try {
      // migrations need to be run one at a time in order
      let list = await getMigrationList(neo4j, path);
      // create an array of closures for each migration
      const funcs = list.map((migration) => () => this.doMigration(migration, neo4j, neo4jConfig));
      // execute the closures in sequence
      await serial(funcs);
    } catch (err) {
    } finally {
      await neo4j.close();
    }
  }

  async doMigration(migration: Migration, neo4j: Neo4JService, neo4jConfig: Neo4jConfig) {
    if (!migration.applied) {
      const cmd =
        'cat ' +
        migration.filename +
        ' | cypher-shell -a ' +
        neo4jConfig.url +
        ' -u ' +
        neo4jConfig.username +
        ' -p ' +
        neo4jConfig.password +
        ' -d ' +
        neo4jConfig.database;

      await execp(cmd, {
        stdout: process.stdout,
        stderr: process.stderr,
      });

      await neo4j.addLevel(migration.name);

      let line = (migration.name + ' '.repeat(40)).substring(0, 40);
      line = line + 'Applied changes';
      console.log(line);
      return 'Applied Changes';
    } else {
      let line = (migration.name + ' '.repeat(40)).substring(0, 40);
      line = line + 'Nothing to do';
      console.log(line);
      return 'Nothing to do';
    }
  }
}
