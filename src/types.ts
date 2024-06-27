export type color = [number, number, number];
export type vec = {
  x: number;
  y: number;
  z: number;
  dot: (v: vec) => number;
  sub: (v: vec) => vec;
};
export type sphere = { center: vec; radius: number; color: color };
