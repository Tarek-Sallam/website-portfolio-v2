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
		const dist = 5;
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
			const outerSphereMaterial = new THREE.MeshStandardMaterial({ roughness: 0.8, color: 'blue' });
			outerSphere.material = outerSphereMaterial;
			outerSphere.rotation.set(-Math.PI * 1.5, 0, 0);
			outerSphere.position.set(0, 0, 0);
			outerSphere.scale.set(1.75, 1.75, 1.75);
			scene.add(outerSphere);
		});

		// uniforms (object with values) to pass into shader -> contains mouse, color, time, and sway scale and speed
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

		// create the sphere
		const weirdSphere = new THREE.IcosahedronGeometry(1, 30);

		// create the material and load the vertex and fragment shader with the uniforms object
		const weirdMaterial = new THREE.ShaderMaterial({
			vertexShader: vertexShader,
			fragmentShader: fragmentShader,
			uniforms: uniforms
		});

		// create the mesh and load the material and sphere created above
		const weirdMesh = new THREE.Mesh(weirdSphere, weirdMaterial);

		// add the mesh to the scene
		scene.add(weirdMesh);

		// set the camera position in z direction to dist variable above
		camera.position.z = dist;

		// create the lights and add it to the scene one by one
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

		// create a new effect composer
		const composer = new EffectComposer(renderer);

		// create a new renderPass
		const renderPass = new RenderPass(scene, camera);

		// create a new FXAA shader pass
		const fxaaPass = new ShaderPass(FXAAShader);

		// create a new output pass
		const outputPass = new OutputPass();

		// get the pixel ratio of the renderer
		const pixelRatio = renderer.getPixelRatio();

		// fxaa config settings
		fxaaPass.material.uniforms['resolution'].value.x = 1 / (container.offsetWidth * pixelRatio);
		fxaaPass.material.uniforms['resolution'].value.y = 1 / (container.offsetHeight * pixelRatio);

		// bloom pass before configuration
		const bloomPass = new UnrealBloomPass(
			new THREE.Vector3(window.innerWidth, window.innerHeight),
			0.8,
			0.1,
			0
		);

		// adding passes to composer
		composer.addPass(renderPass);
		composer.addPass(bloomPass);
		composer.addPass(fxaaPass);
		composer.addPass(outputPass);

		// animation loop
		function animate() {
			uniforms.uTime.value += 0.01;
			uniforms.uMouse.value.x += (mouse.x - uniforms.uMouse.value.x) * 0.075;
			uniforms.uMouse.value.y += (mouse.y - uniforms.uMouse.value.y) * 0.075;
			camera.position.x += (mouse.x / 2 - camera.position.x) * 0.05;
			camera.position.y += (mouse.y / 2 - camera.position.y) * 0.05;
			let XY = new THREE.Vector2(camera.position.x, camera.position.y);
			camera.position.z = dist * Math.sin(Math.acos(XY.length() / dist));
			camera.lookAt(0, 0, 0);
			requestAnimationFrame(animate);
			composer.render();
		}

		animate();
	});
</script>

<div class="canvas-container" bind:this={container} />
<svelte:window on:mousemove={handleMouseMove} />
