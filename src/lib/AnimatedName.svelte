<script>
	import { onMount } from 'svelte';
	import './css/AnimatedName.css';

	let firstRef;
	let lastRef;

	let extraFirstNames = [];
	let extraLastNames = [];

	function getNumberOfNames(width) {
		let count = 1;
		let remainder = window.innerWidth - width;
		while (remainder > 0) {
			count++;
			remainder -= width;
		}
		return count;
	}

	function setNamesList(n, n2) {
		extraFirstNames = [];
		extraLastNames = [];
		let obj;
		for (let i = 0; i < 2; i++) {
			let m = n;
			if (i == 1) {
				m = n2;
			}
			for (let j = 0; j < m * 2; j++) {
				obj = {};
				if (j % 2 == 0) {
					obj.classes = 'overlay ';
				} else {
					obj.classes = 'outline ';
				}
				if (i == 0) {
					obj.classes += 'first-name';
					extraFirstNames.push(obj);
				} else {
					obj.classes += 'last-name';
					extraLastNames.push(obj);
				}
			}
		}
	}

	onMount(() => {
		const numFirstNames = getNumberOfNames(firstRef.offsetWidth);
		const numLastNames = getNumberOfNames(lastRef.offsetWidth);
		extraFirstNames = [];
		extraLastNames = [];
		setNamesList(numFirstNames, numLastNames);
	});
</script>

<div class="name-container">
	<span class="name-wrapper">
		<p class="overlay first-name">TAREK</p>
		<p bind:this={firstRef} class="outline first-name">TAREK</p>
		{#each extraFirstNames as name}
			<p class={name.classes}>TAREK</p>
		{/each}
	</span>
	<span class="name-wrapper">
		<p class="overlay last-name">SALLAM</p>
		<p bind:this={lastRef} class="outline last-name">SALLAM</p>
		{#each extraLastNames as name}
			<p class={name.classes}>SALLAM</p>
		{/each}
	</span>
</div>
