import { type WorkoutModel, type Lift } from "./database/Workout.svelte";

export function calculateNextWorkout(lastWorkout: WorkoutModel) {
    const type = lastWorkout.type == "A" ? "B" : "A";
    const exercises = [];
    switch (type) {
        case "A":
            exercises.push({ lift: "squat", weight: 200 });
        case "B":
    }
    return {
        name: `Workout ${type}`,
        lastPerformed: lastWorkout.startTime,
        durationEstimate: "45 min",
        exercises: [
            { name: "Squat", sets: "5x5", weight: 225 },
            { name: "Bench Press", sets: "5x5", weight: 135 },
            { name: "Barbell Row", sets: "5x5", weight: 135 },
        ],
    };
}

export function liftDisplayName(lift: Lift): string {
    switch (lift) {
        case "squat":
            return "Squat";
        case "benchPress":
            return "Bench Press";
        case "barbellRow":
            return "Barbell Row";
        case "ohp":
            return "Overhead Press";
        case "deadlift":
            return "Deadlift";
    }
}

// export const roundToEasyLoad = (
//     targetWeight: number,
//     smallestWeight: 45 | 35 | 25 | 10 | 5 | 2.5 = 2.5,
// ) => {
//     const barWeight = 45;
//     if (targetWeight <= barWeight) return barWeight;
//
//     // Standard plates, filtered by what the gym actually has
//     const allPlates = [45, 35, 25, 10, 5, 2.5];
//     const availablePlates = allPlates.filter((p) => p >= smallestWeight);
//
//     // Define our 10% acceptable window
//     const minTotalWeight = targetWeight * 0.9;
//     const maxTotalWeight = targetWeight * 1.1;
//
//     // The bar goes up in increments of 2x the smallest plate
//     const increment = smallestWeight * 2;
//
//     let bestWeight = targetWeight;
//     let minPlates = Infinity;
//     let minDifference = Infinity;
//
//     // Helper: Greedily counts how many plates are needed for ONE side of the bar
//     const getPlateCountForSide = (sideWeight: number) => {
//         let count = 0;
//         let remaining = sideWeight;
//
//         for (const plate of availablePlates) {
//             if (remaining >= plate) {
//                 const platesToLoad = Math.floor(remaining / plate);
//                 count += platesToLoad;
//                 remaining -= platesToLoad * plate;
//             }
//         }
//
//         // Return Infinity if the weight can't be made exactly with available plates
//         return remaining < 0.01 ? count : Infinity;
//     };
//
//     // Start at the lowest valid barbell weight inside our 10% window
//     let currentPlateWeight =
//         Math.ceil((minTotalWeight - barWeight) / increment) * increment;
//     if (currentPlateWeight < 0) currentPlateWeight = 0;
//
//     let currentTotalWeight = barWeight + currentPlateWeight;
//
//     // Scan every achievable weight in the window
//     while (currentTotalWeight <= maxTotalWeight) {
//         const sideWeight = (currentTotalWeight - barWeight) / 2;
//         const platesNeeded = getPlateCountForSide(sideWeight);
//
//         if (platesNeeded < minPlates) {
//             // We found a weight that requires fewer plates!
//             minPlates = platesNeeded;
//             bestWeight = currentTotalWeight;
//             minDifference = Math.abs(currentTotalWeight - targetWeight);
//         } else if (platesNeeded === minPlates) {
//             // Tie-breaker: If two weights require the same number of plates,
//             // pick the one closer to the original target.
//             const diff = Math.abs(currentTotalWeight - targetWeight);
//             if (diff < minDifference) {
//                 bestWeight = currentTotalWeight;
//                 minDifference = diff;
//             }
//         }
//
//         currentTotalWeight += increment;
//     }
//
//     // Fallback just in case (e.g., window is too tight for large smallestWeight)
//     if (minPlates === Infinity) {
//         const standardPlateWeight =
//             Math.round((targetWeight - barWeight) / increment) * increment;
//         return barWeight + standardPlateWeight;
//     }
//
//     return bestWeight;
// };

export type ValidPlate = 45 | 35 | 25 | 10 | 5 | 2.5 | 1.25;

export interface EasyLoadOptions {
    smallestWeight?: ValidPlate;
    tolerancePercent?: number; // e.g., 0.1 for 10%
    barWeight?: number;
}

export const roundToEasyLoad = (
    targetWeight: number,
    {
        smallestWeight = 2.5,
        tolerancePercent = 0.1,
        barWeight = 45,
    }: EasyLoadOptions = {},
) => {
    // Edge case: Target is lighter than the bar itself
    if (targetWeight <= barWeight) return barWeight;

    // Safety check: ensure tolerance is a valid positive number
    const safeTolerance = Math.max(0, tolerancePercent);

    // Standard plates, filtered by what the gym actually has
    const allPlates = [45, 35, 25, 10, 5, 2.5, 1.25];
    const availablePlates = allPlates.filter((p) => p >= smallestWeight);

    // Define our acceptable window
    const minTotalWeight = targetWeight * (1 - safeTolerance);
    const maxTotalWeight = targetWeight * (1 + safeTolerance);

    // The bar goes up in increments of 2x the smallest plate
    const increment = smallestWeight * 2;

    let bestWeight = targetWeight;
    let minPlates = Infinity;
    let minDifference = Infinity;

    // Helper: Greedily counts how many plates are needed for ONE side of the bar
    // Uses integer math (* 100) to avoid JavaScript floating point bugs
    const getPlateCountForSide = (sideWeight: number) => {
        let count = 0;
        let remaining = Math.round(sideWeight * 100);

        for (const plate of availablePlates) {
            const plateInt = Math.round(plate * 100);
            if (remaining >= plateInt) {
                const platesToLoad = Math.floor(remaining / plateInt);
                count += platesToLoad;
                remaining -= platesToLoad * plateInt;
            }
        }

        // Return Infinity if the weight can't be made exactly with available plates
        return remaining === 0 ? count : Infinity;
    };

    // Start at the lowest valid barbell weight inside our window
    let currentPlateWeight =
        Math.ceil((minTotalWeight - barWeight) / increment) * increment;
    if (currentPlateWeight < 0) currentPlateWeight = 0;

    let currentTotalWeight = barWeight + currentPlateWeight;

    // Scan every achievable weight in the window
    // Added +0.001 to maxTotalWeight to ensure we don't skip the top bound due to float rounding
    while (currentTotalWeight <= maxTotalWeight + 0.001) {
        const sideWeight = (currentTotalWeight - barWeight) / 2;
        const platesNeeded = getPlateCountForSide(sideWeight);

        if (platesNeeded < minPlates) {
            // We found a weight that requires fewer plates!
            minPlates = platesNeeded;
            bestWeight = currentTotalWeight;
            minDifference = Math.abs(currentTotalWeight - targetWeight);
        } else if (platesNeeded === minPlates) {
            // Tie-breaker: If two weights require the same number of plates,
            // pick the one closer to the original target.
            const diff = Math.abs(currentTotalWeight - targetWeight);
            if (diff < minDifference) {
                bestWeight = currentTotalWeight;
                minDifference = diff;
            }
        }

        // Float-safe increment
        currentTotalWeight =
            Math.round((currentTotalWeight + increment) * 100) / 100;
    }

    // Fallback just in case the window is too tight for the smallestWeight increment
    if (minPlates === Infinity) {
        const standardPlateWeight =
            Math.round((targetWeight - barWeight) / increment) * increment;
        return barWeight + Math.max(0, standardPlateWeight);
    }

    return bestWeight;
};

export interface BarbellConfig {
    targetWeight: number;
    tolerancePercent: number;
    smallestPlate?: number;
    barWeight?: number;
    availablePlates?: number[];
}

export interface BarbellResult {
    totalWeight: number;
    platesPerSide: number[];
    totalPlatesCount: number;
}

export function findMinimalPlates(config: BarbellConfig): BarbellResult | null {
    const {
        targetWeight,
        tolerancePercent,
        smallestPlate = 2.5,
        barWeight = 45,
        availablePlates = [45, 35, 25, 10, 5, 2.5, 1.25],
    } = config;

    const minTotalWeight = targetWeight * (1 - tolerancePercent);
    const maxTotalWeight = targetWeight * (1 + tolerancePercent);

    const minSideWeight = (minTotalWeight - barWeight) / 2;
    const maxSideWeight = (maxTotalWeight - barWeight) / 2;

    const validPlates = availablePlates
        .filter((plate) => plate >= smallestPlate)
        .sort((a, b) => b - a);

    if (barWeight >= minTotalWeight && barWeight <= maxTotalWeight) {
        return {
            totalWeight: barWeight,
            platesPerSide: [],
            totalPlatesCount: 0,
        };
    }
    if (maxSideWeight < 0) {
        return null;
    }

    let queue: { currentSum: number; plates: number[] }[] = [
        { currentSum: 0, plates: [] },
    ];
    const MAX_PLATES_PER_SIDE = 12; // Safety cap to prevent infinite loops

    while (queue.length > 0) {
        const nextQueue: typeof queue = [];

        for (const { currentSum, plates } of queue) {
            if (currentSum >= minSideWeight && currentSum <= maxSideWeight) {
                return {
                    totalWeight: barWeight + currentSum * 2,
                    platesPerSide: plates,
                    totalPlatesCount: plates.length * 2,
                };
            }

            if (plates.length >= MAX_PLATES_PER_SIDE) continue;

            const lastPlate =
                plates.length > 0 ? plates[plates.length - 1] : Infinity;

            for (const plate of validPlates) {
                if (plate <= lastPlate && currentSum + plate <= maxSideWeight) {
                    nextQueue.push({
                        currentSum: currentSum + plate,
                        plates: [...plates, plate],
                    });
                }
            }
        }

        queue = nextQueue;
    }

    return null;
}
