import mongoose from "mongoose";

import { connectToInMemoryDb } from "../../../infra/db/connect.js";
import inMemoryMongo from "../../../infra/db/inMemoryMongo.js";

import TasksDbInterface from "../../../infra/db/interface/task.js";
import TaskRepo from "../../repo/task/TaskRepo.js";
import TaskModifier from "./TaskModifier.js";
import TaskCreator from "../TaskCreater/TaskCreator.js";

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
        new TaskModifier();
    } catch (error) {
        resultErr = error;
    }
    expect(resultErr.message).toBe("Invalid task repo is passed.");
});

test("Should throw exception if wrong repo is passed.", () => {
    let resultErr = {};
    try {
        new TaskModifier({});
    } catch (error) {
        resultErr = error;
    }
    expect(resultErr.message).toBe("Invalid task repo is passed.");
});

test("Should throw exception if wrong taskId is passed.", async () => {
    let resultErr = {};
    const repo = new TaskRepo(TasksDbInterface, UsersDbInterface);
    const TaskModifierTest = new TaskModifier(repo);
    try {
        await TaskModifierTest.modify({
            order: 0,
            taskId: "61b8c71068c3eb001fec2ff9",
            status: "inQueue",
            title: "Do this first.",
            description: "Test desc.",
        });
    } catch (error) {
        resultErr = error;
    }
    expect(resultErr.message).toBe("Modifying task failed.");
});

test("Should modify task if correct task is passed.", async () => {
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
    const index = tasks.findIndex((el) => {
        return el.title === "Do this" && el.status === "inQueue" && el.order === 0;
    });

    const taskId = tasks[index]._id.toString();
    const TaskModifierTest = new TaskModifier(repo);

    try {
        await TaskModifierTest.modify({
            taskId,
            status: "done",
        });
    } catch (error) {
        console.log(error);
    }

    const tasksAfterModification = await TasksDbInterface.find({ userId });
    const found =
        tasksAfterModification.findIndex((el) => {
            return el._id.toString() === taskId && el.status === "done";
        }) > -1;

    expect(found).toBe(true);
});
