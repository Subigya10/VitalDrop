const SequelizeMock = require("sequelize-mock");

const dbMock = new SequelizeMock();

const UserModel = dbMock.define("User", {
  UserId: 1,
  fullName: "John Doe",
  email: "john.doe@example.com",
  password: "hashedpassword",
  phoneNumber: "1234567890",
  address: "123 Main St",
  gender: "Male",
  bloodGroup: "O+",
  medicalHistory: "None",
  dateOfBirth: "1990-01-01",
  role: "user",
});

describe("User Model", () => {

  it("should create a user with valid attributes", async () => {
    const user = await UserModel.create({
      fullName: "Jane Smith",
      email: "jane.smith@example.com",
      password: "anotherhashedpassword",
      phoneNumber: "0987654321",
      address: "456 Elm St",
      gender: "Female",
      bloodGroup: "A-",
      medicalHistory: "Asthma",
      dateOfBirth: "1985-05-15",
      role: "admin",
    });

    expect(user.fullName).toBe("Jane Smith");
    expect(user.email).toBe("jane.smith@example.com");
    expect(user.password).toBe("anotherhashedpassword");
    expect(user.phoneNumber).toBe("0987654321");
    expect(user.address).toBe("456 Elm St");
    expect(user.gender).toBe("Female");
    expect(user.bloodGroup).toBe("A-");
    expect(user.medicalHistory).toBe("Asthma");
    expect(user.dateOfBirth).toBe("1985-05-15");
    expect(user.role).toBe("admin");
  });

  it("should create a user even with missing attributes (mock behavior)", async () => {
    const user = await UserModel.create({});
    expect(user).toBeDefined();
  });

//   it("should FAIL on purpose", async () => {
//     const user = await UserModel.create({
//       fullName: "John Doe"
//     });
//     expect(user.fullName).toBe("Jane Doe"); // John !== Jane → FAIL
//   });
it("should FAIL if fullName is missing (forced fail)", async () => {
  const user = await UserModel.create({}); 
//   await expect(UserModel.create({})).rejects.toThrow(); // No fields
  expect(user.fullName).toBeDefined(); // fullName is undefined → FAIL
});

});

module.exports = UserModel;

// npx jest test/userModel.test.js