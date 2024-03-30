<script>
	import { onMount } from "svelte"
	import IconSwitch from "./IconSwitch.svelte"
	import { localStore } from "./localstorage"
	import { get } from "svelte/store"
	import axios from "axios"

	let audio

	const minimumStability = localStore("mythfall-ping-minimum", 500)

	let enabled = false
	let response = undefined
	let lastChecked = undefined

	let time = Date.now()

	onMount(() => {
		if ($minimumStability == undefined) {
			$minimumStability = 500
		}

		setInterval(() => updateAndAlert(), 1000 * 6)
		setInterval(() => (time = Date.now()), 100)
	})

	const apiUrl = () =>
		`https://api.allorigins.win/get?url=${encodeURIComponent("https://alpha.mythfall.com:7779/api/status?ts=" + time)}`

	const updateAndAlert = async () => {
		lastChecked = Date.now()
		let resp = JSON.parse((await axios.get(apiUrl())).data.contents)
		// We already have a number!
		if (
			enabled &&
			response &&
			response?.Spheres &&
			response?.Spheres.length > 0 &&
			response?.Spheres[0].Stability < get(minimumStability)
		) {
			if (audio) audio?.play()

			console.log("Alerting!")
			enabled = false
		}
		response = resp
	}

	$: timeSince = Math.round((time - lastChecked) / 1000)
</script>

<main>
	<audio src="new_notification.wav" bind:this={audio} preload="auto"></audio>
	<div class="header centered">
		<h1>Mythfall Boss Pinger</h1>
		<span
			>Made with ❤️ by <a href="https://discord.com/channels/@me/113267282838327296/" target="_blank">@gin</a>
		</span>
		<small class="contributions"
			>With contributions from
			<a href="https://discord.com/channels/@me/278185704889122816/" target="_blank">@Mqix</a>
			and
			<a href="https://discord.com/channels/@me/287954569844097024/" target="_blank">@SamieZaurus</a>
		</small>
	</div>

	<div class="config-stats-wrapper">
		<div class="stats">
			<div>
				<span>PLAYER COUNT</span>
				<h2>{response?.NumPlayers ?? "?"}</h2>
			</div>
			<div>
				<span>SPHERE STABILITY</span>
				{#if response?.Spheres && response?.Spheres.length > 0}
					<h2>{response?.Spheres[0].Stability ?? "?"}</h2>
				{:else}
					<h2>?</h2>
				{/if}
			</div>
		</div>

		<div class="config">
			<span>Notify me when stability drops below</span>
			<input type="number" id="tentacles" bind:value={$minimumStability} name="tentacles" min="10" max="9999" />
		</div>
	</div>

	<div class="centered enabled-wrapper">
		<IconSwitch on:click={() => (enabled = !enabled)} {enabled} />
		{#if enabled}
			<div class="instructor">
				<span>Keep this page open!</span>
			</div>
		{/if}
	</div>

	{#if lastChecked}
		<small>Updated {timeSince} seconds ago.</small>
	{:else}
		<small>Last updated @ {lastChecked ?? "not updated yet"}</small>
	{/if}
</main>

<style lang="scss">
	h1 {
		color: var(--text-900);
	}

	a {
		color: rgb(123, 196, 255);
		text-decoration: none;
		font-weight: bold;
	}

	.enabled-wrapper {
		min-width: 250px;
		gap: 1.5rem;
		:global(.icon-switch) {
			width: 100%;
		}
	}

	.contributions {
		font-size: 12px;
	}

	.config-stats-wrapper {
		display: flex;
		align-items: center;
		gap: 2rem;
		flex-direction: column;
		justify-content: center;
	}

	.config {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		width: 100%;
		justify-content: space-between;
	}

	input {
		max-width: 90px;
		color: var(--text);
		background-color: var(--bg-600);
		padding: 0.5rem;
		border: unset;
		border-bottom: 1px solid var(--text-900);
		border-top-left-radius: 0.75rem;
		border-bottom-right-radius: 0.75rem;
	}

	.centered {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.instructor {
		font-weight: 700;
		color: var(--red);
		font-size: 1.3rem;
		padding: 1rem 1.2rem;
		background-color: var(--bg-600);
		border-radius: 12px;
		width: 100%;
	}

	.stats {
		display: flex;
		flex-direction: row;
		gap: 1.5rem;
		width: 100%;

		& > div {
			background-color: var(--bg-600);
			padding: 1rem 1.9rem;
			display: flex;
			flex-direction: column;
			align-items: center;
			border-radius: 0.75rem;
		}
	}
</style>
