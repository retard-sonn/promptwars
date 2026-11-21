#!/usr/bin/env bash
set -euo pipefail
shopt -s nullglob
models=(public/models/*.glb)
if [ ${#models[@]} -eq 0 ]; then
  echo "Procedural geometry is in use. No GLB assets need optimisation."
  exit 0
fi
for model in "${models[@]}"; do
  npx gltf-transform dedup "$model" "$model"
  npx gltf-transform prune "$model" "$model"
  npx gltf-transform weld "$model" "$model"
  npx gltf-transform quantize "$model" "$model"
  npx gltf-transform draco "$model" "$model"
done
