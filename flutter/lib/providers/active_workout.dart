import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/dummy_data.dart';
import '../models/workout.dart';

class ActiveWorkoutNotifier extends Notifier<Workout> {
  @override
  Workout build() {
    return dummyNextWorkout()..startTime = DateTime.now();
  }

  void cycleSet(int exerciseIndex, int setIndex, {required bool isWarmup}) {
    state.exercises[exerciseIndex].cycleSet(setIndex, isWarmup: isWarmup);
    ref.notifyListeners();
  }

  void setWorkingWeight(int exerciseIndex, double weight) {
    final ex = state.exercises[exerciseIndex];
    ex.workingWeight = weight;
    ex.workingSets = List.generate(
      ex.workingSets.length,
      (_) => ExerciseSet(weight: weight, targetReps: 5),
    );
    ref.notifyListeners();
  }

  void finish() {
    state.endTime = DateTime.now();
    ref.notifyListeners();
  }
}

final activeWorkoutProvider = NotifierProvider<ActiveWorkoutNotifier, Workout>(
  ActiveWorkoutNotifier.new,
);
