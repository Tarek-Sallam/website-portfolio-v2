<script>
	import { onMount } from 'svelte';
	import './css/AnimatedName.css';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';

	function handleEnter() {
		// PAUSE
	}

	function handleLeaveBack() {
		// PLAY
	}

	// on mount set names using resize handle
	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);
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
	});
</script>

<div class="name-container">
	<span class="name-wrapper">
		<p class="overlay first-name">TAREK</p>
		<p class="outline first-name">TAREK</p>
	</span>
	<span class="name-wrapper">
		<p class="overlay last-name">SALLAM</p>
		<p class="outline last-name">SALLAM</p>
	</span>
</div>
