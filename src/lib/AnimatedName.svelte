<script>
	import { onMount } from 'svelte';
	import './css/AnimatedName.css';
	import { gsap } from 'gsap';

	//HTML element refs
	let firstRef;
	let lastRef;

	let firstWrapperRef;
	let lastWrapperRef;

	// list of names that will be added and dynamically changed on resize
	let extraFirstNames = [];
	let extraLastNames = [];

	// get the number of names algorithm
	function getNumberOfNames(width) {
		let count = 0;
		let remainder = window.innerWidth - width;
		while (remainder > 0) {
			count++;
			remainder -= width;
		}
		return count;
	}

	// sets the name list with proper object given the amount of names
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
		return extraFirstNames, extraLastNames;
	}

	function animateNames(namesWrapper, width, direction) {}

	// on window resize
	function handleResize() {
		const numFirstNames = getNumberOfNames(firstRef.offsetWidth);
		console.log(firstRef.offsetWidth);
		console.log(window.innerWidth);
		const numLastNames = getNumberOfNames(lastRef.offsetWidth);
		extraFirstNames, (extraLastNames = setNamesList(numFirstNames, numLastNames));
	}

	// on mount set names using resize handle
	onMount(() => {
		handleResize();
	});
</script>

<svelte:window on:resize={handleResize} />

<div class="name-container">
	<span class="name-wrapper" bind:this={firstWrapperRef}>
		<p class="overlay first-name">TAREK</p>
		<p bind:this={firstRef} class="outline first-name">TAREK</p>
		{#each extraFirstNames as name}
			<p class={name.classes}>TAREK</p>
		{/each}
	</span>
	<span class="name-wrapper" bind:this={lastWrapperRef}>
		<p class="overlay last-name">SALLAM</p>
		<p bind:this={lastRef} class="outline last-name">SALLAM</p>
		{#each extraLastNames as name}
			<p class={name.classes}>SALLAM</p>
		{/each}
	</span>
</div>
