import { describe, it, expect } from "vitest";
import { findMinimalPlates, roundToEasyLoad } from "./utils";

describe("roundToEasyLoad", () => {
    it("returns 45 for weights less than or equal to the bar weight", () => {
        expect(roundToEasyLoad(0)).toBe(45);
        expect(roundToEasyLoad(20)).toBe(45);
        expect(roundToEasyLoad(45)).toBe(45);
    });

    it("prefers weights with fewer plates within a 10% window", () => {
        expect(roundToEasyLoad(140)).toBe(135);
        expect(roundToEasyLoad(90)).toBe(95);
    });

    it("handles standard increments correctly", () => {
        expect(roundToEasyLoad(135)).toBe(135);
        expect(roundToEasyLoad(225)).toBe(225);
    });

    it("respects the smallestWeight parameter", () => {
        expect(roundToEasyLoad(145, { smallestWeight: 45 })).toBe(135);
        expect(
            roundToEasyLoad(95, { tolerancePercent: 0.15, smallestWeight: 25 }),
        ).toBe(95);
    });

    it("rounds to something achievable when window is tight", () => {
        expect(roundToEasyLoad(300, { smallestWeight: 10 })).toBe(305);
    });
});

describe("findMinimalPlates", () => {
    it("works", () => {
        expect(
            findMinimalPlates({
                targetWeight: 95,
                tolerancePercent: 0.1,
            }),
        ).toEqual({
            totalWeight: 95,
            platesPerSide: [25],
            totalPlatesCount: 2,
        });

        expect(
            findMinimalPlates({
                targetWeight: 85,
                tolerancePercent: 0.15,
            }),
        ).toEqual({
            totalWeight: 95,
            platesPerSide: [25],
            totalPlatesCount: 2,
        });
    });
});
