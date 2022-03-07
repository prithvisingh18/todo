import TasksDbInterface from "../../../infra/db/interface/task.js";
import TaskRepo from "./TaskRepo.js";

test("Should throw exception if no db int is passed.", () => {
    let resultErr = {};
    try {
        new TaskRepo();
    } catch (error) {
        resultErr = error;
    }
    expect(resultErr.message).toBe("Invalid db interface passed for task repo.");
});

test("Should throw exception if wrong db int is passed.", () => {
    let resultErr = {};
    try {
        new TaskRepo({});
    } catch (error) {
        resultErr = error;
    }
    expect(resultErr.message).toBe("Invalid db interface passed for task repo.");
});
