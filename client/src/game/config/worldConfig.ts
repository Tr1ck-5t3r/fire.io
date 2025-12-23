/**
 * Centralized configuration for all world measurements and settings
 */

export interface WorldConfig {
  arena: {
    width: number;          // X dimension of arena
    depth: number;          // Z dimension of arena
    halfWidth: number;      // Computed: width / 2
    halfDepth: number;      // Computed: depth / 2
  };
  walls: {
    height: number;         // Height of walls
    thickness: number;      // Thickness of wall meshes
  };
  boundary: {
    margin: number;         // Distance player must stay away from walls
  };
  textures: {
    ground: string;
    walls: string;
    roof: string;
  };
  tiling: {
    ground: number;         // Texture tile size for ground
    walls: number;          // Texture tile size for walls
  };
  controls: {
    playerMoveSpeed: number;      // Movement speed for the player
    cameraAngularSensibility: number; // Higher = slower mouse turn in Babylon
    mouseSensitivity: number;     // Multiplier used in App.tsx for mouse look
  };
  obstructions: {
    enabled: boolean;      // Whether to create obstructions
    configs: Array<{       // Array of obstruction configurations
      position: [number, number]; // [x, z] position
      width?: number;
      height?: number;
      depth?: number;
      texturePath?: string;
    }>;
  };
}

/**
 * Default world configuration
 * All measurements are in world units
 */
export const worldConfig: WorldConfig = {
  arena: {
    width: 60,
    depth: 40,
    halfWidth: 30,  // Computed from width / 2
    halfDepth: 20,  // Computed from depth / 2
  },
  walls: {
    height: 20,
    thickness: 0.2,
  },
  boundary: {
    margin: 2.5, // Player stays 2 units away from walls
  },
  textures: {
    ground: '/floor-texture.png',
    walls: '/wall-texture.jpg',
    roof: '/roof-texture.jpg',
  },
  tiling: {
    ground: 1,
    walls: 1,
  },
  controls: {
    playerMoveSpeed: 0.08,          // Increased player speed
    cameraAngularSensibility: 10000, // Higher number = slower camera turn
    mouseSensitivity: 0.0005,       // Slightly lower than before
  },
  obstructions: {
    enabled: true,
    configs: [
      // 12 individual long walls positioned for 60x40 rectangular arena
      // All heights set to 4 to match camera height
      // Arena bounds: X: -30 to +30, Z: -20 to +20
      // Walls positioned with wide gaps for free movement
      
      // Vertical walls (North-South orientation) - spread across wider X dimension
      { position: [-18, -8], width: 0.5, height: 4, depth: 10 },   // Left side, bottom
      { position: [-18, 8], width: 0.5, height: 4, depth: 10 },     // Left side, top
      { position: [0, -10], width: 0.5, height: 4, depth: 12 },      // Center, bottom
      { position: [0, 10], width: 0.5, height: 4, depth: 12 },      // Center, top
      { position: [18, -8], width: 0.5, height: 4, depth: 10 },    // Right side, bottom
      { position: [18, 8], width: 0.5, height: 4, depth: 10 },      // Right side, top
      
      // Horizontal walls (East-West orientation) - fit within 40-unit depth
      { position: [-20, -15], width: 12, height: 4, depth: 0.5 },   // Bottom, left
      { position: [8, -15], width: 12, height: 4, depth: 0.5 },     // Bottom, right
      { position: [-20, 15], width: 12, height: 4, depth: 0.5 },     // Top, left
      { position: [8, 15], width: 12, height: 4, depth: 0.5 },       // Top, right
      
      // Additional strategic walls
      { position: [-10, 0], width: 0.5, height: 4, depth: 8 },       // Left-center vertical
      { position: [10, 0], width: 0.5, height: 4, depth: 8 },       // Right-center vertical
    ],
  },
};

/**
 * Helper function to compute derived values
 */
export function getWorldConfig(): WorldConfig {
  return {
    ...worldConfig,
    arena: {
      ...worldConfig.arena,
      halfWidth: worldConfig.arena.width / 2,
      halfDepth: worldConfig.arena.depth / 2,
    },
  };
}
