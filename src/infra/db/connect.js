import mongoose from "mongoose";

const getMongoUrl = () => {
    const {
        MONGO_USERNAME: user,
        MONGO_PASSWORD: pwd,
        MONGO_DATABASE: db,
        MONGO_HOST: host,
    } = process.env;
    const mongoUrl = `mongodb://${user}:${pwd}@${host}/${db}`;
    return mongoUrl;
};

const connectToDb = async (dbURI) => {
    // eslint-disable-next-line
    return new Promise(async (resolve, reject) => {
        // Set up database connection with MongoDB
        // and wait for the connection
        // if (process.env.NODE_ENV === "production") {
        //     dbURI = dbURI + "?replicaSet=quor-searchdb";
        // }
        const db = mongoose.connection;
        const opt = { auto_reconnect: true, useNewUrlParser: true };
        const timeout = 2000;

        db.on("error", function (error) {
            console.error("Error in MongoDb connection: " + error);
            mongoose.disconnect();
        });
        db.on("connected", function () {
            console.log("Database connected.");
            resolve();
        });
        db.on("reconnected", function () {
            console.log("MongoDB reconnected!");
        });
        db.on("disconnected", function () {
            console.log("MongoDB disconnected!");
            setTimeout(async () => await mongoose.connect(dbURI, opt), timeout);
        });
        await mongoose.connect(dbURI, opt);
    });
};

const connectToInMemoryDb = async (dbURI) => {
    // eslint-disable-next-line
    return new Promise(async (resolve, reject) => {
        // Set up database connection with MongoDB
        // and wait for the connection
        // if (process.env.NODE_ENV === "production") {
        //     dbURI = dbURI + "?replicaSet=quor-searchdb";
        // }
        const db = mongoose.connection;
        const opt = {};
        const timeout = 2000;

        db.on("error", function (error) {
            // console.error("Error in MongoDb connection: " + error);
            mongoose.disconnect();
        });
        db.on("connected", function () {
            // console.log("Database connected.");
            resolve();
        });
        db.on("reconnected", function () {
            // console.log("MongoDB reconnected!");
        });
        db.on("disconnected", function () {
            // console.log("MongoDB disconnected!");
            setTimeout(async () => await mongoose.connect(dbURI, opt), timeout);
        });
        await mongoose.connect(dbURI, opt);
    });
};

const connectToOnlineDb = async () => {
    const dbURI = getMongoUrl();
    await connectToDb(dbURI);
};

export { connectToOnlineDb, connectToInMemoryDb };
