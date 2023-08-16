<script>
    import { T } from "@threlte/core";
    import vertexShader from "./shaders/vertex.glsl";
    import fragmentShader from "./shaders/fragment.glsl"
	import { ShaderMaterial, Vector2, Vector3 } from "three";
    let uniforms = {
        uTime: {
        value: 0.0,
      },
      uMouse: {
        value: new Vector2(0, 0),
      },
      uColor: {
        value: new Vector3(0.2, 0.3, 1.0),
      },
      uSwayScale: {
        value: 0.05,
      },
      uSwaySpeed: {
        value: 1.5,
      },
    }
</script>

<T.Mesh>
    <T.ShaderMaterial vertexShader = {vertexShader} fragmentShader = {fragmentShader} uniforms = {uniforms} />
</T.Mesh>