# 3D Vehicle Models

This folder contains GLB/GLTF models for the 3D Car Viewer.

## Model Requirements

### File Format
- **Preferred:** GLB (Binary GLTF) for smaller file sizes
- **Alternative:** GLTF with separate bin/texture files
- **Compression:** DRACO compression recommended for production

### Model Specifications

| Specification | Recommended | Maximum |
|---------------|-------------|---------|
| Polygon Count | 50,000 | 150,000 |
| Texture Size | 2048x2048 | 4096x4096 |
| File Size | < 5MB | < 15MB |

### Mesh Naming Convention

For the color customization and animations to work, meshes should be named:

```
Body           - Main body/paint surface (required for color change)
Wheel_FL       - Front Left wheel
Wheel_FR       - Front Right wheel
Wheel_RL       - Rear Left wheel
Wheel_RR       - Rear Right wheel
Door_FL        - Front Left door
Door_FR        - Front Right door
Door_RL        - Rear Left door (if exists)
Door_RR        - Rear Right door (if exists)
Headlight_L    - Left headlight
Headlight_R    - Right headlight
Taillight_L    - Left taillight
Taillight_R    - Right taillight
Window_*       - Window meshes
Interior       - Interior mesh
```

### Material Setup

- **Body Paint:** Use `MeshStandardMaterial` with:
  - `metalness: 0.5-0.7` for metallic paint
  - `roughness: 0.3-0.5` for glossy finish
  - Clear coat can be simulated with environment reflections

- **Windows:** Use transparent material with `metalness: 0.9, roughness: 0.1`

- **Chrome/Metal:** Use `metalness: 0.9, roughness: 0.2`

### Model Sources

Free 3D car models can be obtained from:
- [Sketchfab](https://sketchfab.com) (many free CC-licensed models)
- [CGTrader](https://cgtrader.com) (free and paid)
- [TurboSquid](https://turbosquid.com)
- [Free3D](https://free3d.com)

### DRACO Compression

To compress models with DRACO:

```bash
# Install gltf-pipeline
npm install -g gltf-pipeline

# Compress a model
gltf-pipeline -i input.glb -o output.glb -d
```

## Expected Files

```
/public/models/
├── README.md (this file)
├── toyota-harrier.glb
├── toyota-corolla-cross.glb
├── toyota-crown.glb
├── toyota-prado.glb
├── toyota-yaris-cross.glb
├── toyota-chr.glb
├── toyota-noah.glb
├── toyota-axio.glb
├── toyota-premio.glb
├── honda-civic.glb
├── honda-crv.glb
├── honda-vezel.glb
├── mitsubishi-pajero.glb
├── nissan-xtrail.glb
└── placeholders/
    ├── suv-placeholder.glb
    ├── sedan-placeholder.glb
    ├── crossover-placeholder.glb
    └── mpv-placeholder.glb
```

## Placeholder Models

Until real models are added, the viewer will display:
1. A stylized placeholder car shape (built-in)
2. Or the fallback 2D image from the vehicle data

## Adding a New Vehicle

1. Export your 3D model as GLB
2. Apply DRACO compression
3. Place in `/public/models/`
4. Add vehicle configuration in `vehicleData.ts`
5. Test in the CarViewer component
