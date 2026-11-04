const { normalizeString, validateRegistration } = require("../src/utils/auth.validation");

describe("normalizeString", () => {
  test("menghapus spasi di awal dan akhir", () => {
    expect(normalizeString("  errin  ")).toBe("errin");
  });

  test("menghasilkan string kosong untuk input bukan string", () => {
    expect(normalizeString(null)).toBe("");
    expect(normalizeString(123)).toBe("");
  });
});

describe("validateRegistration", () => {
  const validInput = {
    username: "student_01",
    email: "STUDENT@example.com",
    password: "password-kuat",
  };

  test("menerima data valid dan menormalkan email", () => {
    expect(validateRegistration(validInput)).toEqual({
      valid: true,
      data: {
        username: "student_01",
        email: "student@example.com",
        password: "password-kuat",
      },
    });
  });

  test("menolak username kurang dari 3 karakter", () => {
    expect(validateRegistration({ ...validInput, username: "ab" }).valid).toBe(false);
  });

  test("menolak username dengan karakter terlarang", () => {
    expect(validateRegistration({ ...validInput, username: "user name" }).valid).toBe(false);
  });

  test("menolak email yang tidak valid", () => {
    expect(validateRegistration({ ...validInput, email: "bukan-email" })).toMatchObject({
      valid: false,
      message: "Format email tidak valid.",
    });
  });

  test("menolak password kurang dari 8 karakter", () => {
    expect(validateRegistration({ ...validInput, password: "1234567" })).toMatchObject({
      valid: false,
      message: "Password harus 8–72 karakter.",
    });
  });

  test("menolak password lebih dari 72 karakter", () => {
    expect(validateRegistration({ ...validInput, password: "a".repeat(73) }).valid).toBe(false);
  });

  test("menolak input kosong", () => {
    expect(validateRegistration({}).valid).toBe(false);
  });
});
