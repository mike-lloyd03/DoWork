import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../models/workout.dart';
import '../providers/active_workout.dart';
import '../widgets/exercise_card.dart';

class WorkoutScreen extends ConsumerWidget {
  const WorkoutScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final workout = ref.watch(activeWorkoutProvider);
    final isComplete = workout.isComplete;

    return Scaffold(
      appBar: AppBar(
        title: Text("Workout ${workout.type == WorkoutType.a ? "A" : "B"}"),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          ...workout.exercises.asMap().entries.map(
            (entry) => Padding(
              padding: const EdgeInsets.only(bottom: 16),
              child: ExerciseCard(exerciseIndex: entry.key),
            ),
          ),
        ],
      ),
      bottomNavigationBar: isComplete
          ? null
          : _FinishBar(
              onFinish: () {
                ref.read(activeWorkoutProvider.notifier).finish();
                Navigator.of(context).pop();
              },
            ),
    );
  }
}

class _FinishBar extends StatelessWidget {
  final VoidCallback onFinish;
  const _FinishBar({required this.onFinish});

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: FilledButton(
          onPressed: onFinish,
          style: FilledButton.styleFrom(minimumSize: const Size.fromHeight(52)),
          child: const Text("Finish Workout"),
        ),
      ),
    );
  }
}
