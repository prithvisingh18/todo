import mongoose from "mongoose";

import { connectToInMemoryDb } from "../../../infra/db/connect.js";
import inMemoryMongo from "../../../infra/db/inMemoryMongo.js";

import TasksDbInterface from "../../../infra/db/interface/task.js";
import TaskRepo from "../../repo/task/TaskRepo.js";
import TaskCreator from "./TaskCreator.js";

import UsersDbInterface from "../../../infra/db/interface/user.js";
import UserRepo from "../../repo/user/UserRepo.js";
import UserCreator from "../UserCreator/UserCreator.js";

beforeAll(async () => {
    await inMemoryMongo.init();
    await connectToInMemoryDb(inMemoryMongo.getUri());
    const userRepo = new UserRepo(UsersDbInterface);
    const UserCreatorTest = new UserCreator(userRepo);
    await UserCreatorTest.save({ name: "Sana", email: "sana@tw.com" });
});

afterAll(async () => {
    await inMemoryMongo.stop();
    return await mongoose.disconnect();
});

test("Should throw exception if no repo is passed.", () => {
    let resultErr = {};
    try {
        new TaskCreator();
    } catch (error) {
        resultErr = error;
    }
    expect(resultErr.message).toBe("Invalid task repo is passed.");
});

test("Should throw exception if wrong repo is passed.", () => {
    let resultErr = {};
    try {
        new TaskCreator({});
    } catch (error) {
        resultErr = error;
    }
    expect(resultErr.message).toBe("Invalid task repo is passed.");
});

test("Should throw exception and not create invalid task, if wrong data is passed.", async () => {
    let resultErr = {};
    const repo = new TaskRepo(TasksDbInterface, UsersDbInterface);
    const TaskCreatorTest = new TaskCreator(repo);
    try {
        await TaskCreatorTest.save({});
    } catch (error) {
        resultErr = error;
    }
    expect(resultErr.message).toBe("INVALID_ORDER, INVALID_TITLE, INVALID_STATUS, INVALID_USER_ID");
    // Partial tests
    resultErr = {};
    try {
        await TaskCreatorTest.save({
            order: 0,
            title: "Do this first.",
            status: "done",
        });
    } catch (error) {
        resultErr = error;
    }
    expect(resultErr.message).toBe("INVALID_USER_ID");

    resultErr = {};
    const res = await UsersDbInterface.find({ email: "sana@tw.com" });
    const userId = res[0]._id.toString();

    try {
        await TaskCreatorTest.save({
            order: 0,
            title: "Do this first.",
            status: "done",
            description: "",
            userId,
        });
    } catch (error) {
        resultErr = error;
    }
    expect(resultErr.message).toBe("INVALID_DESCRIPTION");

    try {
        await TaskCreatorTest.save({
            order: null,
            title: "Do this first.",
            status: "done",
            description: "Valid desc",
            userId,
        });
    } catch (error) {
        resultErr = error;
    }
    expect(resultErr.message).toBe("INVALID_ORDER");
});

test("Should not create task if correct task is passed with incorrect user id.", async () => {
    const repo = new TaskRepo(TasksDbInterface, UsersDbInterface);
    const TaskCreatorTest = new TaskCreator(repo);

    let resultErr = {};
    try {
        await TaskCreatorTest.save({
            order: 0,
            title: "Do this",
            status: "inQueue",
            userId: "61b8c71068c3eb001fec2ff9",
        });
    } catch (error) {
        resultErr = error;
    }
    expect(resultErr.message).toBe("Saving task failed.");
});

test("Should create task if correct task is passed.", async () => {
    const res = await UsersDbInterface.find({ email: "sana@tw.com" });
    const userId = res[0]._id.toString();

    const repo = new TaskRepo(TasksDbInterface, UsersDbInterface);
    const TaskCreatorTest = new TaskCreator(repo);

    await TaskCreatorTest.save({
        order: 0,
        title: "Do this",
        status: "inQueue",
        userId,
    });

    const tasks = await TasksDbInterface.find({ userId });
    const found =
        tasks.findIndex((el) => {
            return el.title === "Do this" && el.status === "inQueue" && el.order === 0;
        }) > -1;

    expect(found).toBe(true);
});
