export class ServiceRegistry {
    constructor() {
        this.services = {};
    }

    add(name, service) {
        this.services[name] = service;
    }

    get(name) {
        return this.services[name];
    }
}

export const services = new ServiceRegistry()
