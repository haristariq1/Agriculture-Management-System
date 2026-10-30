export const digits = (value) => String(value || "").replace(/\D/g, "");
export const formatCnic = (value) => {
  const d = digits(value).slice(0, 13);
  return [d.slice(0, 5), d.slice(5, 12), d.slice(12)].filter(Boolean).join("-");
};
export const validateName = (value) =>
  /^[A-Za-z ]{3,}$/.test(String(value || "").trim());
export const validateCnic = (value) => /^(?:\d{13}|\d{5}-\d{7}-\d)$/.test(String(value || ""));
export const validatePhone = (value) => /^\d{11}$/.test(String(value || ""));
export const validateWage = (value) => Number.isFinite(Number(value)) && Number(value) > 0;
export const validateQuantity = (value) => Number.isFinite(Number(value)) && Number(value) > 0;
export const validateServiceInterval = (value) =>
  Number.isInteger(Number(value)) && Number(value) > 0;
export const validateLogin = (u, p) => Boolean(u?.trim() && p?.trim());
export const validateImage = (file) =>
  ["image/jpeg", "image/png"].includes(file?.type) && file.size <= 1048576;
