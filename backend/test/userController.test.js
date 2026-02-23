// const userControllwer = require("../Controller/userController");
// const Users = require("../Model/userModel");

// jest.mock("../Model/userModel",() => ({
//     create: jest.fn(),
//     findAll: jest.fn(),
//     findOne: jest.fn(),
//     update: jest.fn(),
//     destroy: jest.fn(),
// }));


// describe("User Controller", () => {
//     const mockResponse = () => {
//         const res = {};
//         res.status = jest.fn().mockReturnValue(res);
//         res.json = jest.fn().mockReturnValue(res);
//         return res;
//     };

//     it ("should register a new user", async () => {
//         const req = {
//             body: {
//                 fullName: "Test User",
//                 email: "janesmith@gmai.com",
//                 password: "password123",
//             },
//         };
//         const res = mockResponse=() => {
//             const res = {};
//             res.status = jest.fn().mockReturnValue(res);
//             res.json = jest.fn().mockReturnValue(res);
//             return res;
//         };

//         it("should register a new user", async () => {
//             const req = {
//                 body: {
//                     fullName: "Test User",
//                     email: "jane@gmail.com",
//                     password: "password123",
//                 },
//             };
//             const res = mockResponse();