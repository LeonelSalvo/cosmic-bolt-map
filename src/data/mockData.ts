import type { MindMapNode } from '../types/MindMap';

export const mockData: MindMapNode = {
  id: "root",
  label: "Universe",
  metadata: {
    name: "The Observable Universe",
    description: "The totality of space and time, containing all forms of matter and energy",
    imageUrl: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564"
  },
  children: [
    {
      id: "galaxy1",
      label: "Milky Way",
      metadata: {
        name: "The Milky Way Galaxy",
        description: "Our home galaxy, containing billions of stars, including our Sun",
        imageUrl: "https://images.unsplash.com/photo-1538370965046-79c0d6907d47"
      },
      children: [
        {
          id: "solar1",
          label: "Solar System",
          metadata: {
            name: "The Solar System",
            description: "Our cosmic neighborhood, centered around the Sun",
            imageUrl: "https://images.unsplash.com/photo-1614642264762-d0a3b8bf3700"
          },
          children: [
            {
              id: "planet1",
              label: "Earth",
              metadata: {
                name: "Planet Earth",
                description: "Our blue planet, the only known world to harbor life",
                imageUrl: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4"
              }
            },
            {
              id: "planet2",
              label: "Mars",
              metadata: {
                name: "The Red Planet",
                description: "The fourth planet from the Sun, known for its rusty red color",
                imageUrl: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9"
              }
            }
          ]
        }
      ]
    }
  ]
};