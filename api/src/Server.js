import http from "http";

export class Server {
    #httpServer;
    #routesHandlers = [];
    constructor(host, port) {
        this.host = host;
        this.port = port;
        this.#httpServer = http.createServer(this.#requestListener.bind(this));
        this.#routesHandlers = [];
    }

    start() {
        this.#httpServer.listen(this.port, this.host, () => {
            console.log(`Server is running on http://${this.host}:${this.port}`);
        });
    }

    #requestListener(req, res) {
        const url = req.url;

        for (let i = 0; i < this.#routesHandlers.length; i += 1) {
            const {route, handler} = this.#routesHandlers[i];

            if (route === url) {
                try {
                    handler(req, res);
                } catch (e) {
                    console.log(e);
                    res.writeHead(500);
                    res.end('error');
                }


                return;
            }
        }

        res.writeHead(404);
        res.end('not found');
    }

    addRoute(route, handler) {
        this.#routesHandlers.push({
            route,
            handler
        });
    }
}
