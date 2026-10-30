import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  formatCnic,
  validateCnic,
  validatePhone,
  validateImage,
} from "../validators";
import { addDays } from "../formatters";
import { wageFor } from "../../redux/selectors";
import { KEYS, mutate, payWage, readList } from "../../redux/api";
const memory = new Map();
beforeEach(() => {
  memory.clear();
  vi.stubGlobal("localStorage", {
    getItem: (k) => memory.get(k) ?? null,
    setItem: (k, v) => memory.set(k, v),
    removeItem: (k) => memory.delete(k),
  });
});
describe("business rules", () => {
  it("formats CNIC and validates worker inputs", () => {
    expect(formatCnic("1234512345671")).toBe("12345-1234567-1");
    expect(validateCnic("12345-1234567-1")).toBe(true);
    expect(validatePhone("03001234567")).toBe(true);
    expect(validateImage({ type: "image/png", size: 1048577 })).toBe(false);
  });
  it("uses calendar dates for service intervals", () => {
    expect(addDays("2026-10-30", 7)).toBe("2026-11-06");
  });
  it("calculates present plus half days", () => {
    expect(
      wageFor(
        { id: "w1", dailyWage: 1000 },
        [
          { workerId: "w1", date: "2026-10-01", status: "Present" },
          { workerId: "w1", date: "2026-10-02", status: "Half-day" },
          { workerId: "w1", date: "2026-10-03", status: "Absent" },
        ],
        "2026-10",
      ),
    ).toBe(1500);
  });
  it("blocks duplicate attendance and over-selling", async () => {
    let a = await mutate(
      "attendance",
      "add",
      { workerId: "w1", date: "2026-10-30", status: "Present" },
      "Admin",
    );
    expect(a.data.succeeded).toBe(true);
    a = await mutate(
      "attendance",
      "add",
      { workerId: "w1", date: "2026-10-30", status: "Absent" },
      "Admin",
    );
    expect(a.data.succeeded).toBe(false);
    memory.set(KEYS.crops, JSON.stringify([{ id: "c1", harvestQty: 10 }]));
    a = await mutate(
      "buyers",
      "add",
      {
        name: "Ali Raza",
        cnic: "12345-1234567-1",
        imageBase64: "data:image/png;base64,AA",
        cropId: "c1",
        quantity: 11,
      },
      "Admin",
    );
    expect(a.data.succeeded).toBe(false);
  });
  it("links maintenance and wages to expenses once", async () => {
    memory.set(
      KEYS.equipment,
      JSON.stringify([
        {
          id: "e1",
          name: "Pump",
          lastServiceDate: "2026-10-01",
          serviceIntervalDays: 30,
        },
      ]),
    );
    let a = await mutate(
      "maintenance",
      "add",
      {
        equipmentId: "e1",
        date: "2026-10-30",
        description: "Repair",
        cost: 500,
      },
      "Admin",
    );
    expect(a.data.succeeded).toBe(true);
    expect(
      readList(KEYS.expenses).filter((x) => x.sourceType === "maintenance"),
    ).toHaveLength(1);
    await mutate(
      "maintenance",
      "update",
      { ...a.data.data, cost: 700 },
      "Admin",
    );
    expect(
      readList(KEYS.expenses).filter((x) => x.sourceType === "maintenance"),
    ).toHaveLength(1);
    expect(
      readList(KEYS.expenses).find((x) => x.sourceType === "maintenance")
        .amount,
    ).toBe(700);
    expect(
      (
        await payWage(
          { id: "w1", fullName: "Ali Raza" },
          "2026-10",
          1000,
          "Admin",
        )
      ).data.succeeded,
    ).toBe(true);
    expect(
      (
        await payWage(
          { id: "w1", fullName: "Ali Raza" },
          "2026-10",
          1000,
          "Admin",
        )
      ).data.succeeded,
    ).toBe(false);
  });
});

describe("storage resilience and permissions", () => {
  it("returns an empty list for corrupted storage", () => {
    memory.set(KEYS.workers, "{broken");
    expect(readList(KEYS.workers)).toEqual([]);
  });
  it("reports full storage without a success response", async () => {
    vi.stubGlobal("localStorage", {
      getItem: () => null,
      setItem: () => {
        throw Error("QuotaExceededError");
      },
    });
    const r = await mutate(
      "tasks",
      "add",
      { title: "Test", type: "Irrigation", dueDate: "2026-11-01" },
      "Admin",
    );
    expect(r.data.succeeded).toBe(false);
  });
  it("blocks Manager edit and equipment creation", async () => {
    expect(
      (await mutate("crops", "update", { id: "c1" }, "Manager")).data.succeeded,
    ).toBe(false);
    expect(
      (
        await mutate(
          "equipment",
          "add",
          { name: "Pump", serviceIntervalDays: 30 },
          "Manager",
        )
      ).data.succeeded,
    ).toBe(false);
  });
});

describe("persistence", () => {
  it("reads an added crop back from storage", async () => {
    const r = await mutate(
      "crops",
      "add",
      {
        name: "Millet",
        field: "Field A",
        plantingDate: "2026-01-01",
        cuttingDate: "2026-04-01",
        healthScore: 90,
        harvestQty: 100,
        expectedQty: 120,
      },
      "Admin",
    );
    expect(r.data.succeeded).toBe(true);
    expect(readList(KEYS.crops).some((c) => c.id === r.data.data.id)).toBe(
      true,
    );
  });
});

describe("CRUD coverage", () => {
  const fixtures = {
    crops: {
      name: "Millet",
      field: "Field A",
      plantingDate: "2026-01-01",
      cuttingDate: "2026-04-01",
      healthScore: 90,
      harvestQty: 100,
      expectedQty: 120,
    },
    orders: {
      cropId: "c1",
      quantity: 5,
      orderDate: "2026-10-30",
      status: "Pending",
    },
    tasks: {
      title: "Irrigate",
      type: "Irrigation",
      dueDate: "2026-10-30",
      status: "Pending",
    },
    expenses: { category: "Seeds", amount: 100, date: "2026-10-30" },
    inventory: { item: "Seed", type: "Seed", qty: 10, minQty: 2, unit: "bags" },
    workers: {
      fullName: "Test Worker",
      cnic: "12345-1234567-1",
      phone: "03001234567",
      role: "Farm Hand",
      dailyWage: 1000,
      joinDate: "2026-10-01",
      status: "Active",
    },
    attendance: { workerId: "w1", date: "2026-10-30", status: "Present" },
    equipment: {
      name: "Test Pump",
      type: "Water Pump",
      purchaseDate: "2026-01-01",
      status: "Active",
      lastServiceDate: "2026-10-01",
      serviceIntervalDays: 30,
    },
    maintenance: {
      equipmentId: "eq1",
      date: "2026-10-30",
      description: "Oil change",
      cost: 100,
      performedBy: "Test",
    },
  };
  for (const [module, fixture] of Object.entries(fixtures)) {
    it(`${module} adds, updates and removes`, async () => {
      let r = await mutate(module, "add", fixture, "Admin");
      expect(r.data.succeeded).toBe(true);
      const id = r.data.data.id;
      r = await mutate(module, "update", { ...r.data.data }, "Admin");
      expect(r.data.succeeded).toBe(true);
      r = await mutate(module, "remove", id, "Admin");
      expect(r.data.succeeded).toBe(true);
      expect(readList(KEYS[module]).some((x) => x.id === id)).toBe(false);
    });
  }
});

describe("buyer and inventory flows", () => {
  it("buyer add/edit/delete preserves stock arithmetic", async () => {
    memory.set(KEYS.crops, JSON.stringify([{ id: "c1", harvestQty: 20 }]));
    const photo = "data:image/png;base64,AA==";
    let r = await mutate(
      "buyers",
      "add",
      {
        name: "Ali Raza",
        cnic: "12345-1234567-1",
        imageBase64: photo,
        cropId: "c1",
        quantity: 8,
        unitPrice: 100,
        date: "2026-10-30",
      },
      "Admin",
    );
    expect(r.data.succeeded).toBe(true);
    const buyer = r.data.data;
    expect(
      readList(KEYS.buyers).reduce((n, b) => n + Number(b.quantity), 0),
    ).toBe(8);
    r = await mutate("buyers", "update", { ...buyer, quantity: 12 }, "Admin");
    expect(r.data.succeeded).toBe(true);
    expect(
      readList(KEYS.buyers).reduce((n, b) => n + Number(b.quantity), 0),
    ).toBe(12);
    r = await mutate("buyers", "remove", buyer.id, "Admin");
    expect(r.data.succeeded).toBe(true);
    expect(readList(KEYS.buyers)).toHaveLength(0);
  });
  it("inventory usage is recorded without exceeding stock", async () => {
    const { addusage } = await import("../../redux/api/inventory");
    memory.set(
      KEYS.inventory,
      JSON.stringify([
        {
          id: "i1",
          item: "Seed",
          qty: 5,
          minQty: 1,
          unit: "bags",
          usageHistory: [],
        },
      ]),
    );
    let r = await addusage(
      { id: "i1", quantity: 2, date: "2026-10-30" },
      "Manager",
    );
    expect(r.data.succeeded).toBe(true);
    expect(readList(KEYS.inventory)[0].qty).toBe(3);
    expect(readList(KEYS.inventory)[0].usageHistory).toHaveLength(1);
    r = await addusage(
      { id: "i1", quantity: 4, date: "2026-10-30" },
      "Manager",
    );
    expect(r.data.succeeded).toBe(false);
  });
});

describe("linked expense integrity", () => {
  it("blocks direct changes to a service expense", async () => {
    memory.set(
      KEYS.expenses,
      JSON.stringify([
        { id: "service-s1", sourceType: "maintenance", amount: 100 },
      ]),
    );
    expect(
      (
        await mutate(
          "expenses",
          "update",
          { id: "service-s1", amount: 200 },
          "Admin",
        )
      ).data.succeeded,
    ).toBe(false);
    expect(
      (await mutate("expenses", "remove", "service-s1", "Admin")).data
        .succeeded,
    ).toBe(false);
  });
});
