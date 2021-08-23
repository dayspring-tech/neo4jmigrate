import { readdir } from 'fs/promises';
import * as path from 'path';
import { Neo4JService } from '../neo4j';

export interface Migration {
  filename: string;
  name: string;
  applied: boolean;
}

export async function getMigrationList(
  neo4j: Neo4JService,
  pathToMigrations: string
): Promise<Migration[]> {
  const normPath = path.normalize(pathToMigrations);
  let files = await readdir(pathToMigrations);
  return await Promise.all(
    files.map(async (f: string) => {
      const name = f.replace('.cypher', '');
      const level = await neo4j.checkLevel(name);
      const ret = {
        filename: path.join(normPath, f),
        name: name,
        applied: level !== undefined,
      };
      return ret;
    })
  );
}
