import { type WorkoutModel, type Lift } from "./database/Workout";

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

export const roundToEasyLoad = (
    targetWeight: number,
    smallestWeight: 45 | 35 | 25 | 10 | 5 | 2.5 = 2.5,
) => {
    const barWeight = 45;
    if (targetWeight <= barWeight) return barWeight;

    // Standard plates, filtered by what the gym actually has
    const allPlates = [45, 35, 25, 10, 5, 2.5];
    const availablePlates = allPlates.filter((p) => p >= smallestWeight);

    // Define our 10% acceptable window
    const minTotalWeight = targetWeight * 0.9;
    const maxTotalWeight = targetWeight * 1.1;

    // The bar goes up in increments of 2x the smallest plate
    const increment = smallestWeight * 2;

    let bestWeight = targetWeight;
    let minPlates = Infinity;
    let minDifference = Infinity;

    // Helper: Greedily counts how many plates are needed for ONE side of the bar
    const getPlateCountForSide = (sideWeight: number) => {
        let count = 0;
        let remaining = sideWeight;

        for (const plate of availablePlates) {
            if (remaining >= plate) {
                const platesToLoad = Math.floor(remaining / plate);
                count += platesToLoad;
                remaining -= platesToLoad * plate;
            }
        }

        // Return Infinity if the weight can't be made exactly with available plates
        return remaining < 0.01 ? count : Infinity;
    };

    // Start at the lowest valid barbell weight inside our 10% window
    let currentPlateWeight =
        Math.ceil((minTotalWeight - barWeight) / increment) * increment;
    if (currentPlateWeight < 0) currentPlateWeight = 0;

    let currentTotalWeight = barWeight + currentPlateWeight;

    // Scan every achievable weight in the window
    while (currentTotalWeight <= maxTotalWeight) {
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

        currentTotalWeight += increment;
    }

    // Fallback just in case (e.g., window is too tight for large smallestWeight)
    if (minPlates === Infinity) {
        const standardPlateWeight =
            Math.round((targetWeight - barWeight) / increment) * increment;
        return barWeight + standardPlateWeight;
    }

    return bestWeight;
};
