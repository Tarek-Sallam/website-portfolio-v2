<script>
    import { T } from "@threlte/core"
</script>

<T.PerspectiveCamera makeDefault position={[0, 0, 10]} />
<T.Mesh position = {[0, 0, 0]}>
    <T.BoxGeometry args={[1, 1, 1]}/>
    <T.MeshBasicMaterial color={[0, 0, 0]} />
</T.Mesh>