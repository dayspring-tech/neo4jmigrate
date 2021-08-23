import neo4j, { Driver } from 'neo4j-driver';

export interface Neo4jConfig {
  url: string;
  username: string;
  password: string;
  database: string;
}

export class Neo4JService {
  private driver: Driver;
  constructor(private config: Neo4jConfig) {
    this.driver = neo4j.driver(
      config.url,
      neo4j.auth.basic(config.username, config.password)
    );
  }
  async close() {
    await this.driver.close();
  }

  async checkLevel(level: string) {
    const session = this.driver.session({
      defaultAccessMode: neo4j.session.READ,
      database: this.config.database,
    });
    try {
      const result = await session.run(
        'MATCH (a:MigrationLevel {token: $level}) RETURN a',
        { level }
      );

      const singleRecord = result.records[0];
      if (singleRecord) {
        return singleRecord.get(0);
      } else {
        return undefined;
      }
    } finally {
      await session.close();
    }
  }

  async addLevel(level: string): Promise<string> {
    return new Promise((resolve, reject) => {
      let session = this.driver.session({
        defaultAccessMode: neo4j.session.WRITE,
        database: this.config.database,
      });

      const txc = session.beginTransaction();

      txc
        .run(
          'match (ml:MigrationLevel)' +
            ' where not (ml)-[:MIGRATION_APPLIED]->()' +
            ' merge (ml)-[:MIGRATION_APPLIED {time: apoc.date.toISO8601(datetime().epochMillis+3000, "ms")}]->(ml2:MigrationLevel {token: $level})' +
            ' return ml2;',
          { level }
        )
        .then((result) => {

          if (result.records.length > 0) {

            resolve(result.records[0].get(0).token);
          } else {
            throw 'Not able to update level';
          }

          return txc.commit();
        })
        .catch((err) => {

          reject(err);
          return txc.rollback();
        })
        .then(() => {

          return session.close();
        });

    });
  }
}
