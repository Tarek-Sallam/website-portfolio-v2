<script>
	import '../css/ThreeApp.css';
	import * as THREE from 'three';
	import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
	import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
	import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
	import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
	import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';
	import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
	import { onMount } from 'svelte';
	import vertexShader from './shaders/vertex.glsl';
	import fragmentShader from './shaders/fragment.glsl';
	import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

	let container;
	let mouse = { x: 0, y: 0 };

	function handleMouseMove(e) {
		mouse.x = (e.x / window.innerWidth) * 2 - 1;
		mouse.y = ((window.innerHeight - e.y) / window.innerHeight) * 2 - 1;
	}

	onMount(() => {
		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(
			75,
			window.innerWidth / window.innerHeight,
			0.1,
			1000
		);
		const renderer = new THREE.WebGLRenderer();
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(window.innerWidth, window.innerHeight);

		container.appendChild(renderer.domElement);
		const loader = new GLTFLoader();
		loader.load('./models/modifiedSphere.gltf', function (gltf) {
			const outerSphere = gltf.scene.children[0];
			const outerSphereMaterial = new THREE.MeshStandardMaterial({ roughness: 0.5, color: 'blue' });
			outerSphere.material = outerSphereMaterial;
			outerSphere.rotation.set(-Math.PI * 1.5, 0, 0);
			outerSphere.position.set(0, 0, 0);
			outerSphere.scale.set(1.75, 1.75, 1.75);
			scene.add(outerSphere);
		});

		let uniforms = {
			uTime: {
				value: 0.0
			},
			uMouse: {
				value: new THREE.Vector2(0, 0)
			},
			uColor: {
				value: new THREE.Vector3(0.2, 0.3, 1.0)
			},
			uSwayScale: {
				value: 0.05
			},
			uSwaySpeed: {
				value: 1.5
			}
		};

		const weirdSphere = new THREE.IcosahedronGeometry(1, 20);
		const weirdMaterial = new THREE.ShaderMaterial({
			vertexShader: vertexShader,
			fragmentShader: fragmentShader,
			uniforms: uniforms
		});
		const weirdMesh = new THREE.Mesh(weirdSphere, weirdMaterial);

		scene.add(weirdMesh);

		camera.position.z = 5;

		let light = new THREE.PointLight(0xffffff, 2, 1000, 0);
		light.position.set(3.8, 0, -1.75);
		scene.add(light);

		light = new THREE.PointLight(0xffffff, 2, 1000, 0);
		light.position.set(-3.8, 0, -1.75);
		scene.add(light);

		light = new THREE.PointLight(0xffffff, 2, 1000, 0);
		light.position.set(-3.6, 0.65, -1.75);
		scene.add(light);

		light = new THREE.PointLight(0xffffff, 2, 1000, 0);
		light.position.set(3.6, 0.65, -1.75);
		scene.add(light);

		light = new THREE.PointLight(0xffffff, 2, 1000, 0);
		light.position.set(-3.6, -0.65, -1.75);
		scene.add(light);

		light = new THREE.PointLight(0xffffff, 2, 1000, 0);
		light.position.set(3.6, -0.65, -1.75);
		scene.add(light);

		console.log(scene);
		const composer = new EffectComposer(renderer);

		const renderPass = new RenderPass(scene, camera);

		const fxaaPass = new ShaderPass(FXAAShader);

		const outputPass = new OutputPass();

		const pixelRatio = renderer.getPixelRatio();
		fxaaPass.material.uniforms['resolution'].value.x = 1 / (container.offsetWidth * pixelRatio);
		fxaaPass.material.uniforms['resolution'].value.y = 1 / (container.offsetHeight * pixelRatio);

		const bloomPassAfter = new UnrealBloomPass(
			new THREE.Vector2(window.innerWidth, window.innerHeight),
			0.4,
			2,
			0.1
		);

		const bloomPassBefore = new UnrealBloomPass(
			new THREE.Vector2(window.innerWidth, window.innerHeight),
			0.05,
			0.01,
			0.2
		);
		// adding passes to composer
		composer.addPass(renderPass);
		composer.addPass(fxaaPass);
		composer.addPass(bloomPassBefore);
		composer.addPass(outputPass);
		composer.addPass(bloomPassAfter);

		function animate() {
			requestAnimationFrame(animate);
			uniforms.uTime.value += 0.01;
			uniforms.uMouse.value.x += (mouse.x - uniforms.uMouse.value.x) * 0.075;
			uniforms.uMouse.value.y += (mouse.y - uniforms.uMouse.value.y) * 0.075;
			composer.render();
		}

		animate();
	});
</script>

<div class="canvas-container" bind:this={container} />
<svelte:window on:mousemove={handleMouseMove} />
