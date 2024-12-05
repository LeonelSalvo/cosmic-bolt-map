import type { MindMapNode } from '../../types/MindMap';

export const stars: MindMapNode[] = [
  {
    id: "sun",
    label: "The Sun",
    metadata: {
      name: "Sol",
      description: "Our home star: a G2V yellow dwarf star at the center of our solar system, approximately 4.6 billion years old.",
      imageUrl: "https://images.unsplash.com/photo-1532760270338-b54fa974b784"
    },
    children: [
      {
        id: "inner-planets",
        label: "Inner Planets",
        metadata: {
          name: "Terrestrial Planets",
          description: "The four smallest and rockiest planets in our solar system.",
          imageUrl: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4"
        },
        children: [
          {
            id: "mercury",
            label: "Mercury",
            metadata: {
              name: "Mercury",
              description: "The smallest and innermost planet, with extreme temperature variations.",
              imageUrl: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9"
            }
          },
          {
            id: "venus",
            label: "Venus",
            metadata: {
              name: "Venus",
              description: "Often called Earth's sister planet due to similar size, but with a runaway greenhouse effect.",
              imageUrl: "https://images.unsplash.com/photo-1614314107768-6018061e5e3c"
            }
          }
        ]
      }
    ]
  }
];