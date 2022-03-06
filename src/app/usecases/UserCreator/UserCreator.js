import Errors from "../../utils/errors.js";

class UserCreator {
    constructor(userRepo) {
        if (
            !!userRepo === false ||
            !!userRepo.isUserRepo === false ||
            userRepo.isUserRepo() === false
        ) {
            throw Errors.createError("Invalid user repo is passed.");
        }
        this.userRepo = userRepo;
    }

    errors = [];
    private = {
        validateEmail: (email) => {
            const match = String(email)
                .toLowerCase()
                .match(
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                );
            return !!match;
        },
        validateName: (name) => {
            let _name = String(name);
            if (_name === "null" || _name.length === 0) {
                return false;
            } else {
                return true;
            }
        },
    };

    validate(data) {
        if (!!data.email === false || this.private.validateEmail(data.email) === false) {
            this.errors.push("INVALID_EMAIL");
        }
        if (!!data.name === false || this.private.validateName(data.name) === false) {
            this.errors.push("INVALID_NAME");
        }
    }

    async save(user) {
        this.validate(user);
        if (this.errors.length > 0) {
            let error = this.errors.join(", ");
            this.errors = [];
            throw Errors.createError(error);
        }
        try {
            await this.userRepo.addUser(user);
        } catch (error) {
            throw Errors.createError("Saving user failed.");
        }
    }
}

export default UserCreator;
