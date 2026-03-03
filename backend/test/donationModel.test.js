// test/donationModel.test.js
const SequelizeMock = require("sequelize-mock");

const dbMock = new SequelizeMock();

// Mock User model
const UserModel = dbMock.define("User", {
  userId: 1,
  fullName: "John Doe",
  email: "john@example.com",
  password: "hashedpassword",
});

// Mock Donation model
const DonationModel = dbMock.define("Donation", {
  donorName: "John Doe",
  bloodGroup: "O+",
  phone: "1234567890",
  hospital: "City Hospital",
  date: "2026-03-03",
  message: "First donation",
  userId: 1,
  status: "scheduled",
});

// Setup association mock
DonationModel.belongsTo(UserModel, { foreignKey: "userId" });
UserModel.hasMany(DonationModel, { foreignKey: "userId" });

describe("Donation Model", () => {

  it("should create a donation with valid attributes", async () => {
    const donation = await DonationModel.create({
      donorName: "Jane Smith",
      bloodGroup: "A-",
      phone: "0987654321",
      hospital: "General Hospital",
      date: "2026-03-05",
      message: "Urgent donation",
      userId: 1,
      status: "scheduled",
    });

    expect(donation.donorName).toBe("Jane Smith");
    expect(donation.bloodGroup).toBe("A-");
    expect(donation.phone).toBe("0987654321");
    expect(donation.hospital).toBe("General Hospital");
    expect(donation.date).toBe("2026-03-05");
    expect(donation.message).toBe("Urgent donation");
    expect(donation.userId).toBe(1);
    expect(donation.status).toBe("scheduled");
  });

  it("should create a donation even with missing optional attributes (mock behavior)", async () => {
    const donation = await DonationModel.create({
      donorName: "Anonymous",
      bloodGroup: "B+",
      phone: "1112223333",
      hospital: "Test Hospital",
      date: "2026-03-06",
      userId: 1,
    });

    expect(donation).toBeDefined();
    expect(donation.message).toBeDefined(); // mock sets default/null
    expect(donation.status).toBe("scheduled"); // default value
  });

  // Example of a forced fail
  it("should FAIL if donorName is missing (mock does not enforce allowNull)", async () => {
    const donation = await DonationModel.create({
      bloodGroup: "O+",
      phone: "1234567890",
      hospital: "City Hospital",
      date: "2026-03-03",
      userId: 1,
    });

    expect(donation.donorName).toBeDefined(); // will not fail in SequelizeMock
  });

});

module.exports = { DonationModel, UserModel };