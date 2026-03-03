const bcrypt = require("bcryptjs");

// Mock the Users model
jest.mock("../Model/userModel.js", () => ({
  Users: {
    findOne: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
  },
}));

const { Users } = require("../Model/userModel.js");

jest.mock("bcryptjs", () => ({
  hash: jest.fn().mockResolvedValue("hashedpassword"),
}));

const { register, getById, deleteById } = require("../Controller/userController.js");

// ─── Helper: mock req/res ────────────────────────────────────────────────────

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// ─── REGISTER ────────────────────────────────────────────────────────────────

describe("register", () => {
  it("should return 400 if email or password is missing", async () => {
    const req = { body: { fullName: "John" }, file: null };
    const res = mockRes();

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Email and Password are required" });
  });
});

// ─── GET BY ID ───────────────────────────────────────────────────────────────

describe("getById", () => {
  it("should return 404 if user not found", async () => {
    Users.findByPk.mockResolvedValue(null);

    const req = { params: { id: 99999 } };
    const res = mockRes();

    await getById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
  });
});

// ─── DELETE BY ID ────────────────────────────────────────────────────────────

describe("deleteById", () => {
  it("should delete user successfully", async () => {
    const mockUser = { destroy: jest.fn().mockResolvedValue(true) };
    Users.findByPk.mockResolvedValue(mockUser);

    const req = { params: { id: 1 } };
    const res = mockRes();

    await deleteById(req, res);

    expect(mockUser.destroy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "User deleted successfully" });
  });
});

// npx jest userModel donationModel bloodRequestModel Usercontroller