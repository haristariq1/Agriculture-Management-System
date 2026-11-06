import { describe, it, expect, beforeEach, vi } from "vitest";
vi.mock("../../redux/api/client", () => ({ default: { post: vi.fn(), get: vi.fn(), put: vi.fn(), delete: vi.fn() } }));
import client from "../../redux/api/client";
import { login, getAllUsers, register, create, updateUser, removeUser } from "../../redux/api/users";
describe("user API adapters", () => {
  beforeEach(() => vi.clearAllMocks());
  it("normalizes Admin and Manager login roles into the existing UI contract", async () => {
    client.post.mockResolvedValueOnce({ data: { succeeded: true, message: "OK", user: { role: "admin", token: "a" } } });
    client.post.mockResolvedValueOnce({ data: { succeeded: true, message: "OK", user: { role: "manager", token: "m" } } });
    expect((await login("admin", "password")).data.data.role).toBe("Admin");
    expect((await login("manager", "password")).data.data.role).toBe("Manager");
  });
  it("adapts user envelopes and keeps user CRUD on protected REST paths", async () => {
    client.get.mockResolvedValueOnce({ data: { succeeded: true, data: { users: [{ id: "m1", role: "manager" }] } } });
    expect((await getAllUsers()).data.data[0].role).toBe("Manager");
    client.post.mockResolvedValueOnce({ data: { succeeded: true, data: { id: "m2", role: "manager" } } });
    await register({ fullName: "Manager Person", username: "manager2", email: "m@example.test", password: "secret123" });
    client.post.mockResolvedValueOnce({ data: { succeeded: true, data: { id: "u1", role: "admin" } } });
    await create({ id: "u1", role: "Admin" }); expect(client.post).toHaveBeenCalledWith("/users", { id: "u1", role: "admin" });
    client.put.mockResolvedValueOnce({ data: { succeeded: true, data: { id: "u1", role: "manager" } } });
    await updateUser({ id: "u1", role: "Manager" }); expect(client.put).toHaveBeenCalledWith("/users/u1", { role: "manager" });
    client.delete.mockResolvedValueOnce({ data: { succeeded: true, data: { id: "u1" } } }); await removeUser("u1"); expect(client.delete).toHaveBeenCalledWith("/users/u1");
  });
});
