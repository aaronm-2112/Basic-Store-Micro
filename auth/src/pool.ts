import { Pool, PoolConfig } from "pg";

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
