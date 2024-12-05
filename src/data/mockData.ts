import type { MindMapNode } from '../types/MindMap';
import { stars } from './celestialBodies/stars';
import { galaxies } from './celestialBodies/galaxies';
import { nebulae } from './celestialBodies/nebulae';

export const mockData: MindMapNode = {
  id: "milkyway",
  label: "Milky Way",
  metadata: {
    name: "The Milky Way Galaxy",
    description: "Our spiral galaxy home, containing 100-400 billion stars, massive black holes, and countless nebulae spread across 100,000 light-years.",
    imageUrl: "https://images.unsplash.com/photo-1538370965046-79c0d6907d47"
  },
  children: [
    {
      id: "galactic-center",
      label: "Galactic Center",
      metadata: {
        name: "Sagittarius A*",
        description: "The supermassive black hole at the center of our galaxy, approximately 26,000 light-years from Earth.",
        imageUrl: "https://images.unsplash.com/photo-1465101162946-4377e57745c3"
      },
      children: [
        {
          id: "central-cluster",
          label: "Nuclear Star Cluster",
          metadata: {
            name: "Central Star Cluster",
            description: "The densest known star cluster in our galaxy, surrounding the central black hole.",
            imageUrl: "https://images.unsplash.com/photo-1543722530-d2c3201371e7"
          }
        }
      ]
    },
    {
      id: "orion-arm",
      label: "Orion Arm",
      metadata: {
        name: "Orion-Cygnus Arm",
        description: "Our local spiral arm, containing most of the stars visible from Earth.",
        imageUrl: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a"
      },
      children: [
        {
          id: "local-bubble",
          label: "Local Bubble",
          metadata: {
            name: "Local Interstellar Cloud",
            description: "A cavity in the interstellar medium of the Orion Arm, spanning approximately 300 light-years.",
            imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa"
          },
          children: stars
        }
      ]
    },
    {
      id: "local-group",
      label: "Local Group",
      metadata: {
        name: "Local Group of Galaxies",
        description: "The galaxy group containing the Milky Way and over 54 other galaxies spanning ~10 million light-years.",
        imageUrl: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564"
      },
      children: galaxies
    },
    {
      id: "nebulae-group",
      label: "Notable Nebulae",
      metadata: {
        name: "Remarkable Nebulae",
        description: "Collection of the most notable nebulae in our galaxy.",
        imageUrl: "https://images.unsplash.com/photo-1579033461380-adb47c3eb938"
      },
      children: nebulae
    }
  ]
};