import { ok, bad } from "../index";
export const demoUsers = [
  { username: "admin", password: "Admin@123", role: "Admin" },
  { username: "manager", password: "Manager@123", role: "Manager" },
];
export async function login(username, password) {
  const user = demoUsers.find(
    (x) => x.username === username && x.password === password,
  );
  return user
    ? ok({ username: user.username, role: user.role })
    : bad("Invalid username or password");
}
export async function logout() {
  return ok(null);
}
export async function getAllUsers() {
  return ok(demoUsers.map(({ password, ...x }) => x));
}
export async function getUser(username) {
  return ok(demoUsers.find((x) => x.username === username));
}
export async function create() {
  return bad("Demo users are fixed in this front-end assignment");
}
export async function updateUser() {
  return bad("Demo users are fixed in this front-end assignment");
}
export async function removeUser() {
  return bad("Demo users are fixed in this front-end assignment");
}
