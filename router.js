import { serve } from "https://deno.land/std@0.50.0/http/server.ts";

function makeRouter() {
  return {
    routes: { GET: [], POST: [] },

    get(path, ...callbacks) {
      for (const callback of callbacks) {
        const id = this.routes.GET.length;

        this.routes.GET.push({ id, method: "GET", path, callback });
      }
    },

    post(path, ...callbacks) {
      for (const callback of callbacks) {
        const id = this.routes.POST.length;

        this.routes.POST.push({ id, method: "POST", path, callback });
      }
    },

    next(req, route) {
      return () => {
        const routes = this.routes[route.method];

        const nextRoute = routes[route.id + 1];

        if (nextRoute && typeof nextRoute.callback == "function") {
          nextRoute.callback(req, this.next(req, nextRoute));
        }
      };
    },

    async listen(port, callback) {
      const server = serve({ port });

      callback(this);

      for await (const req of server) {
        const routes = this.routes[req.method];

        if (!routes) throw new Error("Unsupported http method");

        const route = routes.find(({ path }) => path == req.url);

        if (!route) return req.respond({ body: `Cannot ${req.method}` });

        route.callback(req, this.next(req, route));
      }
    },
  };
}

export default makeRouter;
