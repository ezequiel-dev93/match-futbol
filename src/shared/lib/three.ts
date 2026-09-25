import * as THREE from "three";

/**
 * Limpia recursivamente geometrías y materiales de un objeto 3D
 * para evitar fugas de memoria (memory leaks) en WebGL.
 */
export function disposeObject3D(object: THREE.Object3D): void {
  object.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      if (child.geometry) {
        child.geometry.dispose();
      }
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((material) => material.dispose());
        } else {
          child.material.dispose();
        }
      }
    }
  });
}

export { THREE };
