import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter/material.dart';

import '../models/workout.dart';
import '../providers/active_workout.dart';

class ExerciseCard extends ConsumerWidget {
  final int exerciseIndex;

  const ExerciseCard({super.key, required this.exerciseIndex});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final exercise = ref.watch(activeWorkoutProvider).exercises[exerciseIndex];
    final theme = Theme.of(context);

    return Card(
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          spacing: 14,
          children: [
            _ExerciseHeading(exercise: exercise),

            if (exercise.warmupSets.isNotEmpty) ...[
              _SetGroup(
                label: "Warmup",
                icon: Icons.local_fire_department,
                child: _BubbleRow(
                  exerciseIndex: exerciseIndex,
                  sets: exercise.warmupSets,
                  isWarmup: true,
                  showWeights: true,
                ),
              ),
            ],

            _SetGroup(
              label: "Working",
              icon: Icons.fitness_center,
              child: _BubbleRow(
                exerciseIndex: exerciseIndex,
                sets: exercise.workingSets,
                isWarmup: false,
                showWeights: false,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ExerciseHeading extends StatelessWidget {
  final Exercise exercise;

  const _ExerciseHeading({required this.exercise});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Row(
      children: [
        Expanded(
          child: Text(
            exercise.lift.displayName,
            style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
        ),
        Text.rich(
          TextSpan(
            children: [
              TextSpan(
                text: '${exercise.workingWeight.toInt()}',
                style: const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w900,
                  fontFeatures: [FontFeature.tabularFigures()],
                ),
              ),
              TextSpan(
                text: " lbs",
                style: TextStyle(fontSize: 12, color: theme.hintColor),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _SetGroupLabel extends StatelessWidget {
  final String label;
  final IconData icon;
  const _SetGroupLabel({required this.label, required this.icon});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Row(
      spacing: 4,
      children: [
        Icon(icon, color: theme.colorScheme.onSurfaceVariant, size: 16),
        Text(
          label.toUpperCase(),
          style: theme.textTheme.labelSmall?.copyWith(
            color: theme.hintColor,
            fontWeight: FontWeight.bold,
            letterSpacing: 1,
          ),
        ),
      ],
    );
  }
}

class _SetGroup extends StatelessWidget {
  final String label;
  final IconData icon;
  final Widget child;
  const _SetGroup({
    required this.label,
    required this.icon,
    required this.child,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: theme.colorScheme.surfaceContainerHighest.withValues(alpha: 0.5),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        spacing: 8,
        children: [
          _SetGroupLabel(label: label, icon: icon),
          child,
        ],
      ),
    );
  }
}

class _BubbleRow extends ConsumerWidget {
  final int exerciseIndex;
  final List<ExerciseSet> sets;
  final bool isWarmup;
  final bool showWeights;
  const _BubbleRow({
    required this.exerciseIndex,
    required this.sets,
    required this.isWarmup,
    required this.showWeights,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        for (var i = 0; i < sets.length; i++)
          Column(
            spacing: 4,
            children: [
              if (showWeights) ...[
                Text(
                  '${sets[i].weight.toInt()}',
                  style: const TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
              _RepBubble(
                reps: sets[i].completedReps,
                target: sets[i].targetReps,
                onTap: () => ref
                    .read(activeWorkoutProvider.notifier)
                    .cycleSet(exerciseIndex, i, isWarmup: isWarmup),
              ),
            ],
          ),
      ],
    );
  }
}

class _RepBubble extends StatelessWidget {
  final int? reps;
  final int target;
  final VoidCallback onTap;

  const _RepBubble({
    required this.reps,
    required this.target,
    required this.onTap,
  });

  (Color bg, Color fg) _colors(ColorScheme scheme) {
    if (reps == null) {
      return (
        scheme.surfaceContainerHighest,
        scheme.onSurface.withValues(alpha: 0.3),
      );
    }
    if (reps == 0) {
      return (scheme.errorContainer, scheme.onErrorContainer);
    }
    if (reps == target) {
      return (scheme.primary, scheme.onPrimary);
    }
    return (scheme.tertiaryContainer, scheme.onTertiaryContainer);
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final (bg, fg) = _colors(scheme);

    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: Duration(milliseconds: 100),
        width: 52,
        height: 52,
        alignment: Alignment.center,
        decoration: BoxDecoration(color: bg, shape: BoxShape.circle),
        child: Text(
          reps?.toString() ?? "",
          style: TextStyle(
            color: fg,
            fontSize: 20,
            fontWeight: FontWeight.w900,
          ),
        ),
      ),
    );
  }
}
