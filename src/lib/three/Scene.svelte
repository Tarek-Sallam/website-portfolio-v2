<script>
    import { T } from "@threlte/core"
</script>

<T.PerspectiveCamera makeDefault position={[0, 0, 10]} />
<T.Mesh position = {[0, 0, 0]}>
    <T.IcosahedronGeometry args={[1, 1, 1]}/>
</T.Mesh>