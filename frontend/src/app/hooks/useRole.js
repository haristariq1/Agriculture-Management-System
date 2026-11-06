import { useSelector } from "react-redux";
export default function useRole() {
  const role = useSelector((s) => s.user.user?.role);
  return {
    role,
    canEdit: role === "Admin",
    canDelete: role === "Admin",
    canAdd: Boolean(role),
  };
}
