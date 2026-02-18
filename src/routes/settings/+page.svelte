<script lang="ts">
	import {
		User,
		Dumbbell,
		Scale,
		Database,
		Moon,
		Sun,
		ChevronRight,
		TriangleAlert
	} from '@lucide/svelte';

	// Mock Settings State
	let settings = $state({
		bodyweight: 185,
		units: 'lbs', // 'lbs' | 'kg'
		incrementSquat: 5,
		incrementBench: 5,
		incrementRow: 5,
		incrementOHP: 2.5, // Often lower for OHP
		incrementDeadlift: 10,
		restTimer: 90, // seconds
		darkMode: false
	});

	// Theme Toggle Logic (Simple version)
	function toggleTheme() {
		settings.darkMode = !settings.darkMode;
		// In a real app, you'd save this to localStorage and update the <html> tag
		document.documentElement.setAttribute('data-theme', settings.darkMode ? 'dark' : 'light');
	}
</script>

<div class="p-4 space-y-6 pb-24">
	<div class="navbar bg-base-100 rounded-box shadow-sm min-h-[4rem]">
		<div class="flex-1">
			<h1 class="text-xl font-black tracking-tighter text-primary uppercase px-2">Settings</h1>
		</div>
	</div>

	<div class="space-y-2">
		<h2 class="text-xs font-bold text-base-content/50 uppercase ml-2 tracking-widest">Profile</h2>
		<div class="bg-base-100 rounded-box shadow-sm overflow-hidden divide-y divide-base-200">
			<div class="flex justify-between items-center p-4">
				<div class="flex items-center gap-3">
					<div class="bg-base-200 p-2 rounded-lg text-primary">
						<User size={18} />
					</div>
					<span class="font-medium">Body Weight</span>
				</div>
				<div class="flex items-center gap-2">
					<input
						type="number"
						bind:value={settings.bodyweight}
						class="input input-sm input-bordered w-20 text-right font-mono"
					/>
					<span class="text-xs font-bold text-base-content/50">{settings.units}</span>
				</div>
			</div>

			<div class="flex justify-between items-center p-4">
				<div class="flex items-center gap-3">
					<div class="bg-base-200 p-2 rounded-lg text-secondary">
						<Scale size={18} />
					</div>
					<span class="font-medium">Units</span>
				</div>
				<div class="join">
					<button
						class="join-item btn btn-sm {settings.units === 'lbs' ? 'btn-primary' : 'btn-ghost'}"
						onclick={() => (settings.units = 'lbs')}>lbs</button
					>
					<button
						class="join-item btn btn-sm {settings.units === 'kg' ? 'btn-primary' : 'btn-ghost'}"
						onclick={() => (settings.units = 'kg')}>kg</button
					>
				</div>
			</div>
		</div>
	</div>

	<div class="space-y-2">
		<h2 class="text-xs font-bold text-base-content/50 uppercase ml-2 tracking-widest">
			Weight Increments
		</h2>
		<div class="bg-base-100 rounded-box shadow-sm overflow-hidden divide-y divide-base-200">
			<div class="flex justify-between items-center p-4">
				<div class="flex items-center gap-3">
					<div class="bg-base-200 p-2 rounded-lg text-accent">
						<Dumbbell size={18} />
					</div>
					<div class="flex flex-col">
						<span class="font-medium">Squat / Deadlift</span>
						<span class="text-xs text-base-content/50">Larger muscles</span>
					</div>
				</div>
				<select
					class="select select-bordered select-sm font-mono"
					bind:value={settings.incrementSquat}
				>
					<option value={2.5}>2.5 {settings.units}</option>
					<option value={5}>5.0 {settings.units}</option>
					<option value={10}>10.0 {settings.units}</option>
				</select>
			</div>

			<div class="flex justify-between items-center p-4">
				<div class="flex items-center gap-3">
					<div class="bg-base-200 p-2 rounded-lg text-accent">
						<Dumbbell size={18} />
					</div>
					<div class="flex flex-col">
						<span class="font-medium">Press / Row</span>
						<span class="text-xs text-base-content/50">Smaller muscles</span>
					</div>
				</div>
				<select
					class="select select-bordered select-sm font-mono"
					bind:value={settings.incrementOHP}
				>
					<option value={1}>1.0 {settings.units}</option>
					<option value={2.5}>2.5 {settings.units}</option>
					<option value={5}>5.0 {settings.units}</option>
				</select>
			</div>
		</div>
		<p class="text-xs text-base-content/40 px-2">
			Weights will automatically increase by this amount after a successful 5x5.
		</p>
	</div>

	<div class="space-y-2">
		<h2 class="text-xs font-bold text-base-content/50 uppercase ml-2 tracking-widest">App</h2>
		<div class="bg-base-100 rounded-box shadow-sm overflow-hidden divide-y divide-base-200">
			<label class="flex justify-between items-center p-4 cursor-pointer">
				<div class="flex items-center gap-3">
					<div class="bg-base-200 p-2 rounded-lg text-warning">
						{#if settings.darkMode}
							<Moon size={18} />
						{:else}
							<Sun size={18} />
						{/if}
					</div>
					<span class="font-medium">Dark Mode</span>
				</div>
				<input
					type="checkbox"
					class="toggle toggle-primary"
					checked={settings.darkMode}
					onchange={toggleTheme}
				/>
			</label>

			<button
				class="w-full flex justify-between items-center p-4 hover:bg-base-200 transition-colors text-left"
			>
				<div class="flex items-center gap-3">
					<div class="bg-base-200 p-2 rounded-lg text-info">
						<Database size={18} />
					</div>
					<span class="font-medium">Export Data (JSON)</span>
				</div>
				<ChevronRight size={18} class="text-base-content/30" />
			</button>
		</div>
	</div>

	<div class="pt-6">
		<button class="btn btn-outline btn-error btn-block gap-2">
			<TriangleAlert size={18} />
			Reset All Progress
		</button>
		<div class="text-center mt-4">
			<span class="text-xs text-base-content/30 font-mono">doWork v1.0.0 (Build 24)</span>
		</div>
	</div>
</div>
