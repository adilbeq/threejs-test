export type ShapeName = "sphere" | "box" | "cylinder" | null;

export interface Shape {
  id: string;
  name: ShapeName;
  scale: number;
  position: [number, number, number];
}