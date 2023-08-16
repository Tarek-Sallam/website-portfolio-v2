<script>
    import { Canvas } from '@threlte/core'
    import Scene from './three/Scene.svelte'
</script>

<div class="canvas">
<Canvas useLegacyLights = {false}>
    <Scene />
</Canvas>
</div>

<style>
    .canvas {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
    }
</style>