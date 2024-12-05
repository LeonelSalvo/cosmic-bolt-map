export interface NodeMetadata {
  name?: string;
  description?: string;
  imageUrl?: string;
}

export interface MindMapNode {
  id: string;
  label: string;
  children?: MindMapNode[];
  metadata?: NodeMetadata;
}

export interface NodePosition {
  x: number;
  y: number;
  node: MindMapNode;
  level: number;
  parentId?: string;
}

export interface VisibleNode {
  nodeId: string;
  parentId?: string;
}