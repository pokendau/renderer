import { color, vec, sphere } from "./types";
import "./style.css";

const canvas: HTMLCanvasElement = document.querySelector("canvas");
canvas.id = "main";
canvas.width = 300;
canvas.height = 300;

document.querySelector("body").classList.add("body");
const ctx = canvas.getContext("2d");
let canvas_buffer = ctx.getImageData(0, 0, canvas.width, canvas.height);

const projection_plane_z: number = 1;
const viewportSize = 1;
const camera_position = Vec(0, 0, 0);
const scene = {
  spheres: [
    Sphere(Vec(0, -1, 3), 1, [255, 0, 0]),
    Sphere(Vec(2, 0, 4), 1, [0, 0, 255]),
    Sphere(Vec(-2, 0, 4), 1, [0, 255, 0]),
  ],
};

function drawPixel(x: number, y: number, color: color) {
  x = canvas.width / 2 + x;
  y = canvas.height / 2 + y;

  if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) return;
  let offset = 4 * (x + canvas_buffer.width * y);

  canvas_buffer.data[offset++] = color[0];
  canvas_buffer.data[offset++] = color[1];
  canvas_buffer.data[offset++] = color[2];
  canvas_buffer.data[offset++] = 255;

  // ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
  // ctx.fillRect(x * _unitSize, y * _unitSize, _unitSize, _unitSize);
}

function UpdateCanvas() {
  ctx.putImageData(canvas_buffer, 0, 0);
}

function canvasToViewport(x: number, y: number) {
  return Vec(
    (x * viewportSize) / canvas.width,
    (y * viewportSize) / canvas.height,
    projection_plane_z
  );
}

function Vec(x: number, y: number, z: number): vec {
  return {
    x,
    y,
    z,
    dot: function (vec: vec) {
      return this.x * vec.x + this.y * vec.y + this.z * vec.z;
    },
    sub: function (vec: vec) {
      return Vec(this.x - vec.x, this.y - vec.y, this.z - vec.z);
    },
  };
}

function Sphere(center: vec, radius: number, color: color) {
  return {
    center,
    radius,
    color,
  };
}

function TraceRay(O: vec, D: vec, t_min: number, t_max: number) {
  let closestT: number = Infinity;
  let closestSphere: sphere = undefined;
  scene.spheres.forEach((sphere) => {
    const { t1, t2 } = IntersectRaySphere(O, D, sphere);
    if (t1 > t_min && t1 < t_max && t1 < closestT) {
      closestT = t1;
      closestSphere = sphere;
    }
    if (t2 > t_min && t2 < t_max && t2 < closestT) {
      closestT = t2;
      closestSphere = sphere;
    }
  });
  if (closestSphere == undefined) {
    const toReturn: color = [256, 256, 256];
    return toReturn;
  }
  // @ts-ignore
  return closestSphere.color;
}

function IntersectRaySphere(O: vec, D: vec, sphere: sphere) {
  const CO = O.sub(sphere.center);

  const a = D.dot(D);
  const b = 2 * CO.dot(D);
  const c = CO.dot(CO) - sphere.radius * sphere.radius;

  const discriminant = b * b - 4 * a * c;
  if (discriminant < 0) {
    return {
      t1: Infinity,
      t2: Infinity,
    };
  }
  const t1 = (-b + Math.sqrt(discriminant)) / (2 * a);
  const t2 = (-b - Math.sqrt(discriminant)) / (2 * a);

  return {
    t1,
    t2,
  };
}

const O = Vec(0, 0, 0);
for (let x = -canvas.width / 2; x < canvas.width / 2; x++) {
  for (let y = -canvas.height / 2; y < canvas.height / 2; y++) {
    const D = canvasToViewport(x, y);
    const color = TraceRay(camera_position, D, 1, Infinity);
    drawPixel(x, y, color);
  }
}

UpdateCanvas();
