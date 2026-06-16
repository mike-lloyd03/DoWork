import '../models/workout.dart';

List<ExerciseSet> _workingSets(double weight, int count) =>
    List.generate(count, (_) => ExerciseSet(weight: weight, targetReps: 5));

List<ExerciseSet> _warmupSets(double top) => [
  ExerciseSet(weight: 45, targetReps: 5),
  ExerciseSet(weight: (top * .5).roundToDouble(), targetReps: 5),
  ExerciseSet(weight: (top * .7).roundToDouble(), targetReps: 5),
  ExerciseSet(weight: (top * .9).roundToDouble(), targetReps: 5),
];

Exercise _ex(Lift lift, double weight, {int sets = 5}) => Exercise(
  lift: lift,
  workingWeight: weight,
  warmupSets: _warmupSets(weight),
  workingSets: _workingSets(weight, sets),
);

Workout dummyNextWorkout() => Workout(
  type: WorkoutType.a,
  exercises: [
    _ex(Lift.squat, 185),
    _ex(Lift.benchPress, 135),
    _ex(Lift.barbellRow, 115),
  ],
);

List<Workout> dummyHistory() => [
  Workout(
    id: 1,
    type: WorkoutType.a,
    startTime: DateTime.now().subtract(const Duration(days: 2, hours: 4)),
    endTime: DateTime.now().subtract(const Duration(days: 2, hours: 3)),
    exercises: [
      _ex(Lift.squat, 185)..success = true,
      _ex(Lift.benchPress, 135)..success = true,
      _ex(Lift.barbellRow, 115)..success = true,
    ],
  ),
  Workout(
    id: 2,
    type: WorkoutType.b,
    startTime: DateTime.now().subtract(const Duration(days: 2, hours: 4)),
    endTime: DateTime.now().subtract(const Duration(days: 2, hours: 3)),
    exercises: [
      _ex(Lift.squat, 190)..success = true,
      _ex(Lift.ohp, 115)..success = false,
      _ex(Lift.deadlift, 225)..success = true,
    ],
  ),
];
