import { MongoMemoryServer } from "mongodb-memory-server";

class InMemoryMongo {
    constructor() {}

    mongod = null;
    async init() {
        this.mongod = await MongoMemoryServer.create();
        console.log(this.mongod.getUri());
    }

    getUri() {
        return this.mongod.getUri();
    }

    stop() {
        return this.mongod.stop();
    }
}

export default new InMemoryMongo();
