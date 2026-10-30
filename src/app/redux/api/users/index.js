import { ok, bad, KEYS, readList, writeList, uid } from "../index";
import { seedData } from "../../../../fake-db/seedData";
export const demoUsers = seedData.users;
const users = () => {
  const list = readList(KEYS.users);
  return list.length ? list : demoUsers;
};
const publicUser = ({ password, ...user }) => user;
export async function login(username, password) {
  const user = users().find(
    (x) => x.username === username && x.password === password,
  );
  return user ? ok(publicUser(user)) : bad("Invalid username or password");
}
export async function logout() {
  return ok(null);
}
export async function getAllUsers() {
  return ok(users().map(publicUser));
}
export async function getUser(id) {
  const user = users().find((x) => x.id === id || x.username === id);
  return user ? ok(publicUser(user)) : bad("User not found");
}
export async function create(data, role) {
  if (role !== "Admin") return bad("Admin permission required");
  const list = users();
  if (
    !data.username?.trim() ||
    !data.password ||
    data.password.length < 6 ||
    !["Admin", "Manager"].includes(data.role)
  )
    return bad(
      "Username, role and password of at least 6 characters are required",
    );
  if (
    list.some((x) => x.username.toLowerCase() === data.username.toLowerCase())
  )
    return bad("Username already exists");
  const item = {
    id: uid(),
    username: data.username.trim(),
    password: data.password,
    role: data.role,
  };
  return writeList(KEYS.users, [...list, item])
    ? ok(publicUser(item), "User added")
    : bad("Storage is full or unavailable");
}
export async function updateUser(data, role) {
  if (role !== "Admin") return bad("Admin permission required");
  const list = users(),
    previous = list.find((x) => x.id === data.id);
  if (!previous) return bad("User not found");
  if (data.role && !["Admin", "Manager"].includes(data.role))
    return bad("Invalid role");
  if (
    previous.role === "Admin" &&
    data.role === "Manager" &&
    list.filter((x) => x.role === "Admin").length === 1
  )
    return bad("Cannot demote the last Admin");
  if (data.password && data.password.length < 6)
    return bad("Password must have at least 6 characters");
  if (
    data.username &&
    list.some(
      (x) =>
        x.id !== data.id &&
        x.username.toLowerCase() === data.username.toLowerCase(),
    )
  )
    return bad("Username already exists");
  const item = {
    ...previous,
    ...data,
    password: data.password || previous.password,
  };
  return writeList(
    KEYS.users,
    list.map((x) => (x.id === item.id ? item : x)),
  )
    ? ok(publicUser(item), "User updated")
    : bad("Storage is full or unavailable");
}
export async function removeUser(id, role) {
  if (role !== "Admin") return bad("Admin permission required");
  const list = users(),
    target = list.find((x) => x.id === id);
  if (!target) return bad("User not found");
  if (
    target.role === "Admin" &&
    list.filter((x) => x.role === "Admin").length === 1
  )
    return bad("Cannot remove the last Admin");
  return writeList(
    KEYS.users,
    list.filter((x) => x.id !== id),
  )
    ? ok({ id }, "User removed")
    : bad("Storage is full or unavailable");
}
