jest.mock("../src/config/database", () => ({ query: jest.fn() }));
jest.mock("bcryptjs", () => ({
  hash: jest.fn().mockResolvedValue("hashed-password"),
  compare: jest.fn(),
}));

const pool = require("../src/config/database");
const bcrypt = require("bcryptjs");
const {
  register,
  login,
  authenticateToken,
} = require("../src/controllers/auth.controller");
const jwt = require("jsonwebtoken");

function createResponse() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe("auth controller", () => {
  const originalSecret = process.env.JWT_SECRET;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test-secret-that-is-longer-than-32-characters";
  });

  afterAll(() => {
    if (originalSecret === undefined) {
      delete process.env.JWT_SECRET;
    } else {
      process.env.JWT_SECRET = originalSecret;
    }
  });

  test("register menolak input tidak valid tanpa query database", async () => {
    const req = { body: { username: "x", email: "invalid", password: "123" } };
    const res = createResponse();

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(pool.query).not.toHaveBeenCalled();
  });

  test("register menolak secret yang belum dikonfigurasi sebelum menyimpan user", async () => {
    delete process.env.JWT_SECRET;
    const req = { body: { username: "student_01", email: "student@example.com", password: "password-kuat" } };
    const res = createResponse();

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(pool.query).not.toHaveBeenCalled();
  });

  test("register menyimpan hash password dan mengembalikan token", async () => {
    pool.query.mockResolvedValue({
      rows: [{ id: 7, username: "student_01", email: "student@example.com", role: "user" }],
    });
    const req = { body: { username: "student_01", email: "STUDENT@example.com", password: "password-kuat" } };
    const res = createResponse();

    await register(req, res);

    expect(bcrypt.hash).toHaveBeenCalledWith("password-kuat", 12);
    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO users"),
      ["student_01", "student@example.com", "hashed-password"]
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json.mock.calls[0][0].token).toBeTruthy();
  });

  test("register mengembalikan 409 ketika username atau email sudah digunakan", async () => {
    const duplicateError = new Error("duplicate");
    duplicateError.code = "23505";
    pool.query.mockRejectedValue(duplicateError);
    const req = { body: { username: "student_01", email: "student@example.com", password: "password-kuat" } };
    const res = createResponse();

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
  });

  test("login menolak kredensial yang salah", async () => {
    pool.query.mockResolvedValue({ rows: [] });
    const req = { body: { identifier: "unknown@example.com", password: "password-kuat" } };
    const res = createResponse();

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(bcrypt.compare).not.toHaveBeenCalled();
  });

  test("middleware menolak request tanpa Bearer token", () => {
    const req = { headers: {} };
    const res = createResponse();
    const next = jest.fn();

    authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test("middleware menerima token valid", () => {
    const token = jwt.sign({ sub: "7", role: "user" }, process.env.JWT_SECRET, { issuer: "softdev-api" });
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = createResponse();
    const next = jest.fn();

    authenticateToken(req, res, next);

    expect(req.auth.sub).toBe("7");
    expect(next).toHaveBeenCalledTimes(1);
  });
});
