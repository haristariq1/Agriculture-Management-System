import { localDate } from "../app/utils/formatters";
const today = localDate();
export const seedData = {
  crops: [
    {
      id: "c1",
      name: "Wheat",
      field: "North Field",
      plantingDate: "2026-06-10",
      cuttingDate: "2026-11-05",
      healthScore: 86,
      harvestQty: 1200,
      expectedQty: 1400,
    },
    {
      id: "c2",
      name: "Rice",
      field: "East Terrace",
      plantingDate: "2026-07-01",
      cuttingDate: "2026-11-20",
      healthScore: 61,
      harvestQty: 850,
      expectedQty: 1000,
    },
    {
      id: "c3",
      name: "Cotton",
      field: "South Plot",
      plantingDate: "2026-05-14",
      cuttingDate: "2026-10-29",
      healthScore: 42,
      harvestQty: 600,
      expectedQty: 700,
    },
  ],
  orders: [
    {
      id: "o1",
      cropId: "c1",
      quantity: 300,
      orderDate: today,
      status: "Pending",
    },
  ],
  buyers: [],
  tasks: [
    {
      id: "t1",
      title: "Irrigate north field",
      type: "Irrigation",
      cropId: "c1",
      dueDate: today,
      status: "Pending",
    },
  ],
  expenses: [
    {
      id: "ex1",
      cropId: "c1",
      category: "Seeds",
      amount: 24000,
      date: today,
      note: "Demo seed purchase",
    },
  ],
  inventory: [
    {
      id: "i1",
      item: "Urea fertilizer",
      type: "Fertilizer",
      qty: 18,
      minQty: 25,
      unit: "bags",
      usageHistory: [],
    },
  ],
  workers: [
    {
      id: "w1",
      fullName: "Ali Raza",
      cnic: "35202-1234567-1",
      phone: "03001234567",
      role: "Farm Hand",
      dailyWage: 1800,
      joinDate: "2026-01-10",
      status: "Active",
    },
  ],
  attendance: [],
  equipment: [
    {
      id: "eq1",
      name: "Massey 240",
      type: "Tractor",
      purchaseDate: "2024-03-11",
      status: "Active",
      lastServiceDate: "2026-10-01",
      serviceIntervalDays: 30,
      notes: "",
    },
  ],
  maintenance: [],
  activity: [],
  users: [
    { id: "u-admin", username: "admin", password: "Admin@123", role: "Admin" },
    {
      id: "u-manager",
      username: "manager",
      password: "Manager@123",
      role: "Manager",
    },
  ],
};
