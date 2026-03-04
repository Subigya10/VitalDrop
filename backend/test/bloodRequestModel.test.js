// test/bloodRequestModel.test.js
const SequelizeMock = require("sequelize-mock");

const dbMock = new SequelizeMock();

// Mock User model
const UserModel = dbMock.define("User", {
  userId: 1,
  fullName: "John Doe",
  email: "john@example.com",
  password: "hashedpassword",
});

// Mock BloodRequests model
const BloodRequestModel = dbMock.define("BloodRequests", {
  id: 1,
  requesterId: 1,
  donorId: null,
  patientName: "Alice",
  bloodGroup: "A+",
  unitsNeeded: 2,
  hospitalLocation: "City Hospital",
  status: "pending",
});

// Setup association mock
BloodRequestModel.belongsTo(UserModel, { foreignKey: "requesterId" });
UserModel.hasMany(BloodRequestModel, { foreignKey: "requesterId" });

describe("BloodRequests Model", () => {

  it("should create a blood request with valid attributes", async () => {
    const request = await BloodRequestModel.create({
      requesterId: 2,
      patientName: "Bob",
      bloodGroup: "B-",
      unitsNeeded: 3,
      hospitalLocation: "General Hospital",
    });

    expect(request.patientName).toBe("Bob");
    expect(request.bloodGroup).toBe("B-");
    expect(request.unitsNeeded).toBe(3);
    expect(request.hospitalLocation).toBe("General Hospital");
    expect(request.status).toBe("pending"); // default value
  });

  it("should create a blood request even with missing optional attributes", async () => {
    const request = await BloodRequestModel.create({
      requesterId: 3,
      patientName: "Charlie",
      bloodGroup: "O+",
      unitsNeeded: 1,
      hospitalLocation: "Community Clinic",
    });

    expect(request).toBeDefined();
  });

  // Example forced fail
  it("should FAIL if patientName is missing (mock does not enforce allowNull)", async () => {
    const request = await BloodRequestModel.create({
      requesterId: 4,
      bloodGroup: "AB+",
      unitsNeeded: 1,
      hospitalLocation: "Central Hospital",
    });

    expect(request.patientName).toBeDefined(); 
  });

});

module.exports = { BloodRequestModel, UserModel };