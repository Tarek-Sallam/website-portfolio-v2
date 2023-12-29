<script>
	import { onMount } from 'svelte';
	import './css/AnimatedName.css';
	import { gsap } from 'gsap';

	//HTML element refs
	let firstRef;
	let lastRef;

	let firstWrapperRef;
	let lastWrapperRef;

	let firstSelectedRef;
	let lastSelectedRef;

	// list of names that will be added and dynamically changed on resize
	let extraFirstNames = [];
	let extraLastNames = [];

	const spacingRelative = 0.1;
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

	function getStarts({ container, direction, spacing, width }) {
		const children = container.children;
		const viewport = window.innerWidth;
		const remaining = width - viewport; // text minus width of viewport
		const start = direction === 1 ? viewport : -width; // the start depending on direction
		let starts = [];
		starts[0] = direction === 1 ? 0 : -remaining;
		gsap.set(children[0], { x: starts[0] });
		gsap.set(children[1], { x: starts[0] });
		for (let i = 1; i < children.length / 2; i++) {
			if (direction === 1) {
				if (starts[i - 1] + width + spacing < viewport) {
					starts[i] = starts[i - 1] + width + spacing;
				} else {
					starts[i] = start;
				}
			} else if (direction === -1) {
				if (starts[i - 1] - spacing > 0) {
					starts[i] = starts[i - 1] - width - spacing;
				} else {
					starts[i] = start;
				}
			}

			// set position to the current starting position
			gsap.set(children[i * 2], { x: starts[i] });
			gsap.set(children[i * 2 + 1], { x: starts[i] });
		}
		return starts;
	}

	function animateNames({
		// PROPS
		container,
		duration,
		direction,
		spacing,
		width,
		classN,
		starts
	}) {
		const children = container.children;
		const viewport = window.innerWidth;
		const start = direction === 1 ? viewport : -width;
		const end = direction === 1 ? -width : viewport; // find end point
		const distance = width + viewport; // distance needed to travel
		const overflow = width * (children.length / 2 - 1) - viewport; // overflow distance of children and viewport
		const repeatWait = (overflow / distance) * duration; // the delay time between repeating
		const spacingDuration = (spacing / distance) * duration; // duration that takes into account spacing
		const tl = gsap.timeline(); // reference to timeline

		// if there isn't more than 1 child
		if (children.length < 4) {
			return;
		}

		// initial for loop (for all the elements before the last one)
		for (let i = 0; i < children.length / 2 - 1; i++) {
			// calculate initial duration
			const initDuration = (Math.abs(end - starts[i]) / distance) * duration;

			// animation
			tl.to(
				// select the current iteration items
				container.querySelectorAll('.' + classN + (i + 1)),
				{
					x: end, // animate to end
					ease: 'none', // no ease for linear animation
					duration: initDuration, // use initial duration

					// ON COMPLETE: set the selected elements to the starting position
					onComplete: function () {
						gsap.set(container.querySelectorAll('.' + classN + (i + 1)), {
							x: start
						});
					}
				},
				'<' // start at beginning of previous animation
			);
		}

		// last element animation (starts offscreen)
		tl.to(
			container.querySelectorAll('.' + classN + children.length / 2),
			{
				x: end,
				ease: 'none',
				duration: duration,
				repeat: -1, // repeat infinitely

				// calculatethe proper repeat delay including the spacing
				repeatDelay: repeatWait + (children.length / 2) * spacingDuration
			},
			'<' + (repeatWait + (children.length / 2 - 1) * spacingDuration) // start after previous animation plus delay and spacing delay
		);

		for (let j = 0; j < children.length / 2 - 1; j++) {
			tl.to(
				container.querySelectorAll('.' + classN + (j + 1)),
				{
					x: end,
					ease: 'none',
					duration: duration,
					repeat: -1,
					repeatDelay: repeatWait + (children.length / 2) * spacingDuration
				},
				'<' + ((width / distance) * duration + spacingDuration)
			);
		}

		return tl;
	}

	// on window resize
	function handleResize() {
		const spacing = spacingRelative * window.innerWidth;
		const numFirstNames = getNumberOfNames(firstRef.offsetWidth);
		const numLastNames = getNumberOfNames(lastRef.offsetWidth);
		[extraFirstNames, extraLastNames] = setNamesList(numFirstNames, numLastNames);

		const firstProps = {
			container: firstWrapperRef,
			direction: 1,
			spacing: spacing,
			width: firstRef.offsetWidth
		};
		const lastProps = {
			container: lastWrapperRef,
			direction: -1,
			spacing: spacing,
			width: lastRef.offsetWidth
		};

		firstProps['starts'] = getStarts(firstProps);
		lastProps['starts'] = getStarts(lastProps);
		firstProps['duration'] = duration;
		lastProps['duration'] = duration;

		animateNames(firstProps);
		animateNames(lastProps);
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
