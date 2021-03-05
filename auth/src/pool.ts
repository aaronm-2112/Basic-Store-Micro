import { Pool, PoolConfig } from "pg";

// IMP: https://github.com/brianc/node-postgres/tree/master/packages/pg-pool
//      Need to pass information for a non-local postgres instance in through a config object
//      So when postgres is running in a separate container this will need modificaiton
export class PoolSingleton {
  private _pool: Pool | undefined = undefined;
  connect(config: PoolConfig) {
    this._pool = new Pool(config);
    return this._pool.query(`SELECT 1+1;`);
  }
  close() {
    return this._pool?.end();
  }
  query(sql: string, params: any[]) {
    return this._pool?.query(sql, params);
  }
}

const pool = new PoolSingleton();

export { pool as Pool };
