/// <reference path="../.astro/types.d.ts" />
// type D1Database = import("@cloudflare/workers-types").D1Database;
// type DurableObjectNamespace = import("@cloudflare/workers-types").DurableObjectNamespace;
/// <reference path="../.astro/types.d.ts" />
type Runtime = import('@astrojs/cloudflare').Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {
    user: import("/lib/model/User").User | null;
    session: import("/lib/model/Session").Session | null;
  }
}
