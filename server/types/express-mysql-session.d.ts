declare module "express-mysql-session" {
  import type { Store } from "express-session";
  import type { Pool } from "mysql2/promise";

  interface MySQLStoreOptions {
    [key: string]: unknown;
  }

  class MySQLStore extends Store {
    constructor(options: MySQLStoreOptions, connection?: Pool);
  }

  function factory(session: { Store: typeof Store }): typeof MySQLStore;
  export = factory;
}
