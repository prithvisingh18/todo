import mongoose from "mongoose";

import { connectToInMemoryDb } from "../../../infra/db/connect.js";
import inMemoryMongo from "../../../infra/db/inMemoryMongo.js";

import UserDbInterface from "../../../infra/db/interface/user.js";
import UserRepo from "../../repo/user/UserRepo.js";
import UserCreator from "./UserCreator.js";

beforeAll(async () => {
    await inMemoryMongo.init();
    await connectToInMemoryDb(inMemoryMongo.getUri());
});

afterAll(async () => {
    await inMemoryMongo.stop();
    return await mongoose.disconnect();
});

test("Should throw exception if no repo is passed.", () => {
    let resultErr = {};
    try {
        new UserCreator();
    } catch (error) {
        resultErr = error;
    }
    expect(resultErr.message).toBe("Invalid user repo is passed.");
});

test("Should throw exception if wrong repo is passed.", () => {
    let resultErr = {};
    try {
        new UserCreator({});
    } catch (error) {
        resultErr = error;
    }
    expect(resultErr.message).toBe("Invalid user repo is passed.");
});

test("Should throw exception and not create invalid user, if wrong data is passed.", async () => {
    let resultErr = {};
    const repo = new UserRepo(UserDbInterface);
    let UserCreatorTest = new UserCreator(repo);
    try {
        await UserCreatorTest.save({});
    } catch (error) {
        resultErr = error;
    }
    expect(resultErr.message).toBe("INVALID_EMAIL, INVALID_NAME");
    // Partial tests
    try {
        await UserCreatorTest.save({
            name: "Sana",
        });
    } catch (error) {
        resultErr = error;
    }
    expect(resultErr.message).toBe("INVALID_EMAIL");
    try {
        await UserCreatorTest.save({
            email: "tzuyu@tw.com",
        });
    } catch (error) {
        resultErr = error;
    }
    expect(resultErr.message).toBe("INVALID_NAME");

    try {
        await UserCreatorTest.save({
            email: "xyz",
            name: "Sana",
        });
    } catch (error) {
        resultErr = error;
    }
    expect(resultErr.message).toBe("INVALID_EMAIL");
});

test("Should create user if correct user is passed.", async () => {
    const repo = new UserRepo(UserDbInterface);
    const UserCreatorTest = new UserCreator(repo);

    await UserCreatorTest.save({ name: "Sana", email: "sana@tw.com" });

    const res = await repo.find({ email: "sana@tw.com" });
    const found =
        res.findIndex((el) => {
            return el.email === "sana@tw.com";
        }) > -1;

    expect(found).toBe(true);
});
