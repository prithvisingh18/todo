import UsersDbInterface from "../../../infra/db/interface/user.js";
import UserRepo from "./UserRepo.js";

test("Should throw exception if no db int is passed.", () => {
    let resultErr = {};
    try {
        new UserRepo();
    } catch (error) {
        resultErr = error;
    }
    expect(resultErr.message).toBe("Invalid db interface passed for user repo.");
});

test("Should throw exception if wrong db int is passed.", () => {
    let resultErr = {};
    try {
        new UserRepo({});
    } catch (error) {
        resultErr = error;
    }
    expect(resultErr.message).toBe("Invalid db interface passed for user repo.");
});
