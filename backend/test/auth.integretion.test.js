import request from "supertest";
import express from "express";
import bcrypt from "bcryptjs";
import { authRouter } from "../Routes/authRoute.js";
import { sequelize } from "../Database/db.js";
import { Users } from "../Model/userModel.js";

// Build a mini express app for testing
const app = express();
app.use(express.json());
app.use("/api/auth", authRouter);

// ─── Setup & Teardown ───────────────────────────────────────────────────────

beforeAll(async () => {
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean users table before each test
  await Users.destroy({ where: {}, truncate: true, cascade: true });
});

// ─── Helper ─────────────────────────────────────────────────────────────────

const createTestUser = async (overrides = {}) => {
  const hashedPassword = await bcrypt.hash("password123", 10);
  return await Users.create({
    fullName: "Test User",
    email: "test@example.com",
    password: hashedPassword,
    role: "user",
    ...overrides,
  });
};

// ─── POST /api/auth/login ────────────────────────────────────────────────────

describe("POST /api/auth/login", () => {

  it("should login successfully with valid credentials", async () => {
    await createTestUser();

    const res = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(res.status).toBe(200);
    expect(res.body.access_token).toBeDefined();
    expect(res.body.user.email).toBe("test@example.com");
    expect(res.body.user.role).toBe("user");
  });

  it("should return 400 if email or password is missing", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      // password missing
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Email and Password are required");
  });

  it("should return 404 if user does not exist", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "nonexistent@example.com",
      password: "password123",
    });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("User not found");
  });

  it("should return 401 if password is incorrect", async () => {
    await createTestUser();

    const res = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "wrongpassword",
    });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Password is incorrect");
  });

  it("should return a valid JWT token on successful login", async () => {
    await createTestUser();

    const res = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(res.status).toBe(200);
    // JWT has 3 parts separated by dots
    const tokenParts = res.body.access_token.split(".");
    expect(tokenParts.length).toBe(3);
  });

  it("should login successfully as admin", async () => {
    await createTestUser({ email: "admin@example.com", role: "admin" });

    const res = await request(app).post("/api/auth/login").send({
      email: "admin@example.com",
      password: "password123",
    });

    expect(res.status).toBe(200);
    expect(res.body.user.role).toBe("admin");
  });

});

// ─── POST /api/auth/forgotpass ───────────────────────────────────────────────

describe("POST /api/auth/forgotpass", () => {

  it("should return 400 if email is missing", async () => {
    const res = await request(app).post("/api/auth/forgotpass").send({});

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Email is required");
  });

  it("should return 404 if user with email does not exist", async () => {
    const res = await request(app).post("/api/auth/forgotpass").send({
      email: "ghost@example.com",
    });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("User not found");
  });

  it("should save resetPasswordToken to DB when user exists", async () => {
    // Mock nodemailer to avoid actually sending email
    const nodemailer = await import("nodemailer");
    const sendMailMock = jest.fn().mockResolvedValue(true);
    jest.spyOn(nodemailer, "createTransport").mockReturnValue({
      sendMail: sendMailMock,
    });

    await createTestUser();

    await request(app).post("/api/auth/forgotpass").send({
      email: "test@example.com",
    });

    const user = await Users.findOne({ where: { email: "test@example.com" } });
    expect(user.resetPasswordToken).toBeDefined();
    expect(user.resetPasswordExpires).toBeDefined();
  });

});

// ─── POST /api/auth/resetpass/:token ────────────────────────────────────────

describe("POST /api/auth/resetpass/:token", () => {

  it("should return 400 if fields are missing", async () => {
    const res = await request(app)
      .post("/api/auth/resetpass/sometoken")
      .send({ password: "newpass123" }); // confirmPassword missing

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("All fields are required");
  });

  it("should return 400 if passwords do not match", async () => {
    const res = await request(app)
      .post("/api/auth/resetpass/sometoken")
      .send({ password: "newpass123", confirmPassword: "different123" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Passwords do not match");
  });

  it("should return 400 if password is less than 6 characters", async () => {
    const res = await request(app)
      .post("/api/auth/resetpass/sometoken")
      .send({ password: "abc", confirmPassword: "abc" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Password must be at least 6 characters");
  });

  it("should return 400 if token is invalid or expired", async () => {
    const res = await request(app)
      .post("/api/auth/resetpass/invalidtoken")
      .send({ password: "newpass123", confirmPassword: "newpass123" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid or expired reset token");
  });

  it("should reset password successfully with valid token", async () => {
    const user = await createTestUser();

    // Manually set a reset token
    const token = "validresettoken123";
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600 * 1000; // 1 hour from now
    await user.save();

    const res = await request(app)
      .post(`/api/auth/resetpass/${token}`)
      .send({ password: "newpassword123", confirmPassword: "newpassword123" });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Password reset successful");

    // Verify token is cleared in DB
    const updatedUser = await Users.findOne({ where: { email: "test@example.com" } });
    expect(updatedUser.resetPasswordToken).toBeNull();
    expect(updatedUser.resetPasswordExpires).toBeNull();
  });

});

// ─── GET /api/auth/init ──────────────────────────────────────────────────────

describe("GET /api/auth/init", () => {

  it("should return 401 if no token provided", async () => {
    const res = await request(app).get("/api/auth/init");
    expect(res.status).toBe(401);
  });

  it("should return current user info with valid token", async () => {
    await createTestUser();

    // First login to get token
    const loginRes = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "password123",
    });

    const token = loginRes.body.access_token;

    const res = await request(app)
      .get("/api/auth/init")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
  });

});


// /login — 6 tests
// /forgotpass — 3 tests
// /resetpass — 5 tests
// /init — 2 tests