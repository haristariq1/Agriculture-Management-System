import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  login,
  getAllUsers,
  create,
  updateUser,
  removeUser,
} from "../../redux/api/users";
const memory = new Map();
beforeEach(() => {
  memory.clear();
  vi.stubGlobal("localStorage", {
    getItem: (k) => memory.get(k) ?? null,
    setItem: (k, v) => memory.set(k, v),
  });
});
describe("user module", () => {
  it("logs in both demo roles and rejects wrong passwords", async () => {
    expect((await login("admin", "Admin@123")).data.data.role).toBe("Admin");
    expect((await login("manager", "Manager@123")).data.data.role).toBe(
      "Manager",
    );
    expect((await login("admin", "wrong")).data.succeeded).toBe(false);
  });
  it("lets Admin create update and remove a user", async () => {
    let r = await create(
      { username: "newmanager", password: "secret123", role: "Manager" },
      "Admin",
    );
    expect(r.data.succeeded).toBe(true);
    const id = r.data.data.id;
    expect((await getAllUsers()).data.data.some((x) => x.id === id)).toBe(true);
    r = await updateUser({ id, role: "Admin" }, "Admin");
    expect(r.data.data.role).toBe("Admin");
    r = await removeUser(id, "Admin");
    expect(r.data.succeeded).toBe(true);
  });
  it("blocks Manager mutations and removal of last Admin", async () => {
    expect(
      (
        await create(
          { username: "x", password: "secret123", role: "Manager" },
          "Manager",
        )
      ).data.succeeded,
    ).toBe(false);
    expect((await removeUser("u-admin", "Admin")).data.succeeded).toBe(false);
  });
});
