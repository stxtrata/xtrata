export type Env = Record<string, unknown> & {
  DB?: D1Database;
  D1?: D1Database;
  db?: D1Database;
  COLLECTION_ASSETS?: R2Bucket;
  ASSETS?: R2Bucket;
  R2?: R2Bucket;
};

const resolveDb = (env: Partial<Env> & Record<string, unknown>) => {
  const candidate =
    (env.DB as D1Database | undefined) ??
    (env.D1 as D1Database | undefined) ??
    (env.db as D1Database | undefined);
  if (!candidate || typeof candidate.prepare !== 'function') {
    const availableBindings = Object.keys(env)
      .filter((key) => key.trim().length > 0)
      .sort()
      .join(', ');
    throw new Error(
      `Missing D1 binding. Configure D1 as binding \`DB\` for this Pages environment. Available bindings: ${
        availableBindings || 'none'
      }`
    );
  }
  return candidate;
};

export async function queryAll(env: Env, query: string, binds: Array<unknown> = []) {
  const statement = resolveDb(env).prepare(query);
  if (binds.length > 0) {
    return statement.bind(...binds).all();
  }
  return statement.all();
}

export async function run(env: Env, query: string, binds: Array<unknown> = []) {
  const statement = resolveDb(env).prepare(query);
  if (binds.length > 0) {
    return statement.bind(...binds).run();
  }
  return statement.run();
}

/**
 * Runs several statements as one D1 batch (one round trip, all-or-nothing) when the binding supports it,
 * otherwise one after another. Each statement is its own prepared SQL plus bound values.
 */
export async function runBatch(env: Env, statements: Array<{ sql: string; binds?: unknown[] }>) {
  if (statements.length === 0) return;
  const db = resolveDb(env);
  const prepared = statements.map((statement) => {
    const query = db.prepare(statement.sql);
    return statement.binds && statement.binds.length > 0 ? query.bind(...statement.binds) : query;
  });
  if (typeof db.batch === 'function') {
    await db.batch(prepared);
    return;
  }
  for (const query of prepared) await query.run();
}
