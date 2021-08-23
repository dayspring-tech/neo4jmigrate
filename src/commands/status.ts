import { Command, flags } from '@oclif/command';
import { Neo4JService } from '../neo4j';
import { getMigrationList, Migration } from '../migrations';

export default class Status extends Command {
  static description = 'Display the current db migration level.';

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
    const { args, flags } = this.parse(Status);

    const neo4jConfig = {
      url: flags.address,
      username: flags.username,
      password: flags.password,
      database: flags.database,
    };
    const path = args.path;

    const neo4j = new Neo4JService(neo4jConfig);
    try {
      let list = await getMigrationList(neo4j, path);
      this.printStatus(list);
    } finally {
      await neo4j.close();
    }
  }

  private printStatus(list: Migration[]) {
    list.forEach((migration) => {
      let line = (migration.name + ' '.repeat(40)).substring(0, 40);
      line = line + (migration.applied ? 'Applied' : 'Pending');
      console.log(line);
    });
  }
}
