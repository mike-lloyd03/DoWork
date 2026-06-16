import 'package:dowork/data/dummy_data.dart';
import 'package:dowork/models/workout.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final nextWorkout = dummyNextWorkout();

    return SafeArea(
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text(
            "DoWork",
            style: Theme.of(
              context,
            ).textTheme.headlineLarge?.copyWith(fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 24),

          _NextWorkoutCard(workout: nextWorkout, isActive: false),

          const SizedBox(height: 24),

          _StatsRow(bodyWeight: 210, streak: 6),
        ],
      ),
    );
  }
}

class _NextWorkoutCard extends StatelessWidget {
  final Workout workout;
  final bool isActive;

  const _NextWorkoutCard({required this.workout, required this.isActive});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final lastDate = DateTime.now().subtract(const Duration(days: 3));

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Workout ${workout.type == WorkoutType.a ? "A" : "B"}',
                        style: theme.textTheme.headlineMedium?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      SizedBox(height: 4),
                      Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(Icons.history, size: 14, color: theme.hintColor),

                          SizedBox(width: 4),

                          Text(
                            'Last: ${DateFormat('MM/dd/yyyy').format(lastDate)}',
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                _Badge(text: isActive ? "In Progress" : "Next"),
              ],
            ),

            SizedBox(height: 16),

            ...workout.exercises.map((e) => _ExerciseRow(exercise: e)),

            SizedBox(height: 16),

            FilledButton.icon(
              onPressed: () {},
              icon: const Icon(Icons.play_arrow),
              label: Text(isActive ? "Resume Workout" : "Start Workout"),
              style: FilledButton.styleFrom(
                minimumSize: const Size.fromHeight(52),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _Badge extends StatelessWidget {
  final String text;
  const _Badge({required this.text});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: theme.colorScheme.primary,
        borderRadius: BorderRadius.circular(999),
      ),
      child: Text(
        text,
        style: TextStyle(
          color: theme.colorScheme.onPrimary,
          fontWeight: FontWeight.bold,
          fontSize: 13,
        ),
      ),
    );
  }
}

class _ExerciseRow extends StatelessWidget {
  final Exercise exercise;
  const _ExerciseRow({required this.exercise});

  String get _setsLabel {
    final sets = exercise.workingSets;
    if (sets.isEmpty) return 'none';
    final first = sets.first.targetReps;
    final uniform = sets.every((s) => s.targetReps == first);
    return uniform ? '${sets.length}x$first' : 'varied';
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        children: [
          Container(
            padding: EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: theme.colorScheme.primary.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(
              Icons.fitness_center,
              size: 18,
              color: theme.colorScheme.primary,
            ),
          ),

          const SizedBox(width: 12),

          Expanded(
            child: Text(
              exercise.lift.displayName,
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
          ),

          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text.rich(
                TextSpan(
                  children: [
                    TextSpan(
                      text: '${exercise.workingWeight.toInt()}',
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w900,
                        fontFeatures: [FontFeature.tabularFigures()],
                      ),
                    ),
                    TextSpan(
                      text: ' lb',
                      style: TextStyle(fontSize: 12, color: theme.hintColor),
                    ),
                  ],
                ),
              ),
              Text(
                _setsLabel,
                style: theme.textTheme.bodySmall?.copyWith(
                  color: theme.hintColor,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _StatsRow extends StatelessWidget {
  final int bodyWeight;
  final int streak;

  const _StatsRow({required this.bodyWeight, required this.streak});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: _StatTile(
            icon: Icons.monitor_weight_outlined,
            label: "Body Weight",
            value: '$bodyWeight',
            unit: 'lbs',
          ),
        ),

        SizedBox(width: 16),

        Expanded(
          child: _StatTile(
            icon: Icons.emoji_events_outlined,
            label: "Streak",
            value: '$streak',
            unit: 'Workouts',
          ),
        ),
      ],
    );
  }
}

class _StatTile extends StatelessWidget {
  final IconData icon;
  final String label, value, unit;
  const _StatTile({
    required this.icon,
    required this.label,
    required this.value,
    required this.unit,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            Align(
              alignment: Alignment.topRight,
              child: Icon(icon, size: 32, color: theme.colorScheme.secondary),
            ),

            Text(
              label.toUpperCase(),
              style: theme.textTheme.labelSmall?.copyWith(
                fontWeight: FontWeight.bold,
                letterSpacing: 1,
              ),
            ),

            SizedBox(height: 4),

            Text.rich(
              TextSpan(
                children: [
                  TextSpan(
                    text: value,
                    style: theme.textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),

                  TextSpan(
                    text: ' $unit',
                    style: TextStyle(color: theme.colorScheme.secondary),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
