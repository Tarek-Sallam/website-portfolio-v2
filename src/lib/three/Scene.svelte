<script>
    import { T } from "@threlte/core"
	import { BoxGeometry, DirectionalLight, MeshBasicMaterial, PerspectiveCamera } from "three";
</script>

<T.PerspectiveCamera
    makeDefault
    position = {[10, 10, 10]}
    on:create={({ ref }) => {
        ref.lookAt(0, 0, 0)
    }}
/>

<T.DirectionalLight position={[0,10, 10]} />
<T.Mesh position={[0, 0, 0]}>
    <T.BoxGeometry args={[1, 1, 1]}/>
    <T.MeshStandardMaterial color={[0, 0, 0]}/>
</T.Mesh>