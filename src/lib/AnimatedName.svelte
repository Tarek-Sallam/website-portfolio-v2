<script>
	import { onMount } from 'svelte';
	import './css/AnimatedName.css';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import animateNames from './functions/animateNames';
	import getStarts from './functions/getStarts';

	let firstNamesRef = [];
	let lastNamesRef = [];

	let tlFirstRef;
	let tlLastRef;
	let tlLooping;

	let timeoutId;
	let timeoutId2;

	const debounce = function (func, delay) {
		if (timeoutId) {
			window.clearTimeout(timeoutId);
		}
		timeoutId = window.setTimeout(func, delay);
	};

	const debounce2 = function (func, delay) {
		if (timeoutId2) {
			window.clearTimeout(timeoutId2);
		}
		timeoutId2 = window.setTimeout(func, delay);
	};

	// list of names that will be added and dynamically changed on resize
	let extraFirstNames = [];
	let extraLastNames = [];

	const spacing = 0.05;
	const duration = 20;

	// get the number of names algorithm
	function getNumberOfNames(width) {
		let count = 1;
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

		return [extraFirstNames, extraLastNames];
	}

	// on window resize
	function handleResize(callback) {
		debounce(function () {
			console.log('resized');
			const numFirstNames = getNumberOfNames(firstNamesRef[1].offsetWidth);
			const numLastNames = getNumberOfNames(lastNamesRef[1].offsetWidth);
			[extraFirstNames, extraLastNames] = setNamesList(numFirstNames, numLastNames);
			callback();
		}, 250);
	}

	function resizeCallback() {
		debounce2(function () {
			console.log('callback');
			if (firstNamesRef.length > 3 && lastNamesRef.length > 3) {
				if (tlFirstRef) {
					tlFirstRef.kill();
				}
				if (tlLastRef) {
					tlLastRef.kill();
				}
				tlLooping.clear();

				firstNamesRef = firstNamesRef.filter(Boolean);
				lastNamesRef = lastNamesRef.filter(Boolean);

				console.log(firstNamesRef);
				console.log(lastNamesRef);
				const firstProps = {
					children: firstNamesRef,
					direction: 1,
					spacing: spacing * window.innerWidth,
					width: firstNamesRef[1].offsetWidth
				};

				const lastProps = {
					children: lastNamesRef,
					direction: -1,
					spacing: spacing * window.innerWidth,
					width: lastNamesRef[1].offsetWidth
				};

				firstProps['starts'] = getStarts(firstProps);
				lastProps['starts'] = getStarts(lastProps);
				firstProps['duration'] = duration;
				lastProps['duration'] = duration;

				tlFirstRef = animateNames(firstProps);
				tlLastRef = animateNames(lastProps);

				tlLooping.add(tlFirstRef);
				tlLooping.add(tlLastRef, '<');
			}
		}, 100);
	}

	function handleEnter() {
		// PAUSE
	}

	function handleLeaveBack() {
		// PLAY
	}

	// on mount set names using resize handle
	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);
		tlLooping = gsap.timeline();
		/*
		ScrollTrigger.create({
			start: 0.5 * window.innerHeight,
			onEnter: function () {
				handleEnter();
			},
			onLeaveBack: function () {
				handleLeaveBack();
			}
		}); */
		const numFirstNames = getNumberOfNames(firstNamesRef[1].offsetWidth);
		const numLastNames = getNumberOfNames(lastNamesRef[1].offsetWidth);
		[extraFirstNames, extraLastNames] = setNamesList(numFirstNames, numLastNames);
		resizeCallback();
	});
</script>

<svelte:window
	on:resize={function () {
		handleResize(resizeCallback);
	}}
/>

<div class="name-container">
	<span class="name-wrapper">
		<p bind:this={firstNamesRef[0]} class="overlay first-name">TAREK</p>
		<p bind:this={firstNamesRef[1]} class="outline first-name">TAREK</p>
		{#each extraFirstNames as name, index}
			<p class={name.classes} bind:this={firstNamesRef[index + 2]}>TAREK</p>
		{/each}
	</span>
	<span class="name-wrapper">
		<p bind:this={lastNamesRef[0]} class="overlay last-name">SALLAM</p>
		<p bind:this={lastNamesRef[1]} class="outline last-name">SALLAM</p>
		{#each extraLastNames as name, index}
			<p class={name.classes} bind:this={lastNamesRef[index + 2]}>SALLAM</p>
		{/each}
	</span>
</div>
