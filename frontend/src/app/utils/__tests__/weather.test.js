import { describe, it, expect, vi } from "vitest";
vi.mock("axios", () => ({ default: { get: vi.fn() } }));
import axios from "axios";
import { FETCHWEATHER } from "../../redux/actions/weather";
import { weatherReducer } from "../../redux/reducers/weather";

describe("live weather thunk", () => {
  it("dispatches loading then success and keeps update time", async () => {
    axios.get.mockResolvedValueOnce({
      data: { current: { temperature_2m: 25 } },
    });
    let state = weatherReducer(undefined, { type: "init" });
    const dispatch = (action) => {
      state = weatherReducer(state, action);
    };
    await FETCHWEATHER()(dispatch);
    expect(state.status).toBe("succeeded");
    expect(state.data.current.temperature_2m).toBe(25);
    expect(state.lastUpdated).toBeTruthy();
  });
  it("dispatches failure when Open-Meteo is unreachable", async () => {
    axios.get.mockRejectedValueOnce(Error("offline"));
    let state = weatherReducer(undefined, { type: "init" });
    const dispatch = (action) => {
      state = weatherReducer(state, action);
    };
    await FETCHWEATHER()(dispatch);
    expect(state.status).toBe("failed");
    expect(state.error).toBe("offline");
  });
});
