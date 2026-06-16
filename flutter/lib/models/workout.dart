enum Lift {
  squat("Squat", "SQ"),
  benchPress("Bench Press", "BP"),
  barbellRow("Barbell Row", "ROW"),
  ohp("Overhead Press", "OHP"),
  deadlift("Deadlift", "DL");

  final String displayName;
  final String code;

  const Lift(this.displayName, this.code);
}

enum WorkoutType { a, b }

class ExerciseSet {
  double weight;
  int targetReps;
  int? completedReps;

  ExerciseSet({
    required this.weight,
    required this.targetReps,
    this.completedReps,
  });
}

class Exercise {
  Lift lift;
  List<ExerciseSet> warmupSets;
  List<ExerciseSet> workingSets;
  double workingWeight;
  bool? success;

  Exercise({
    required this.lift,
    required this.warmupSets,
    required this.workingSets,
    required this.workingWeight,
    this.success,
  });

  void cycleSet(int index, {required bool isWarmup}) {
    final sets = isWarmup ? warmupSets : workingSets;

    if (index > 0 && sets[index - 1].completedReps == null) return;

    final set = sets[index];
    final current = set.completedReps;
    final target = set.targetReps;

    if (current == null) {
      set.completedReps = target;
    } else if (current > 0) {
      set.completedReps = current - 1;
    } else {
      set.completedReps = null;
    }
  }
}

class Workout {
  int? id;
  DateTime? startTime;
  DateTime? endTime;
  WorkoutType type;
  List<Exercise> exercises;
  String? notes;

  Workout({
    this.id,
    this.startTime,
    this.endTime,
    required this.type,
    required this.exercises,
    this.notes,
  });

  bool get isComplete => endTime != null;
}
