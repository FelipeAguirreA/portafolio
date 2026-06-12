// GLSL — ruido simplex 3D (Ashima Arts / webgl-noise, MIT) + shaders de la escena

const SIMPLEX = /* glsl */ `
vec3 mod289(vec3 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
vec4 mod289(vec4 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
vec4 permute(vec4 x){ return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

float fbm(vec3 p){
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * snoise(p);
    p = p * 2.05 + 13.7;
    a *= 0.5;
  }
  return v;
}
`

export const coreVertex = /* glsl */ `
uniform float uTime;
uniform float uDistortion;
uniform float uSpeed;
varying vec3 vNormal;
varying vec3 vView;
varying float vNoise;

${SIMPLEX}

void main(){
  float t = uTime * uSpeed;
  float n = fbm(position * 0.85 + vec3(t * 0.6, t * 0.35, t * 0.5));
  vNoise = n;
  vec3 displaced = position + normal * n * uDistortion * 0.55;

  // normal aproximada vía gradiente del ruido (epsilon sobre tangentes)
  float eps = 0.12;
  vec3 tangent = normalize(cross(normal, vec3(0.0, 1.0, 0.001)));
  vec3 bitangent = normalize(cross(normal, tangent));
  vec3 pT = position + tangent * eps;
  vec3 pB = position + bitangent * eps;
  float nT = fbm(pT * 0.85 + vec3(t * 0.6, t * 0.35, t * 0.5));
  float nB = fbm(pB * 0.85 + vec3(t * 0.6, t * 0.35, t * 0.5));
  vec3 dT = (pT + normal * nT * uDistortion * 0.55) - displaced;
  vec3 dB = (pB + normal * nB * uDistortion * 0.55) - displaced;
  vec3 newNormal = normalize(cross(dT, dB));

  vec4 mv = modelViewMatrix * vec4(displaced, 1.0);
  vNormal = normalize(normalMatrix * newNormal);
  vView = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}
`

export const coreFragment = /* glsl */ `
uniform vec3 uBase;
uniform vec3 uAccent;
uniform vec3 uCool;
uniform float uGrade;
uniform float uGlow;
varying vec3 vNormal;
varying vec3 vView;
varying float vNoise;

void main(){
  float fresnel = pow(1.0 - max(dot(normalize(vNormal), normalize(vView)), 0.0), 2.2);
  float crest = smoothstep(0.25, 0.85, vNoise);
  // color grading cinematográfico: el rim vira de chartreuse a teal según el capítulo
  vec3 rim = mix(uAccent, uCool, uGrade);
  vec3 col = uBase;
  col = mix(col, rim * 0.55, crest * 0.35);
  col += rim * fresnel * uGlow;
  col += rim * crest * fresnel * 0.4;
  gl_FragColor = vec4(col, 1.0);
}
`

export const particlesVertex = /* glsl */ `
uniform float uTime;
uniform float uSpread;
uniform float uPixelRatio;
uniform float uMorph;
attribute float aScale;
attribute float aPhase;
attribute vec3 aTarget;
varying float vTwinkle;
varying float vMix;
varying float vMorph;

void main(){
  vec3 p = position * uSpread;
  float t = uTime * 0.12 + aPhase;
  // deriva orbital lenta
  float c = cos(t * 0.35);
  float s = sin(t * 0.35);
  p.xz = mat2(c, -s, s, c) * p.xz;
  p.y += sin(t + aPhase * 4.0) * 0.35;

  // morph hacia el monograma "FA" (respiración sutil en destino)
  vec3 tgt = aTarget + vec3(
    sin(uTime * 0.6 + aPhase * 9.0),
    cos(uTime * 0.5 + aPhase * 7.0),
    sin(uTime * 0.4 + aPhase * 5.0)
  ) * 0.05;
  float m = smoothstep(0.0, 1.0, uMorph);
  p = mix(p, tgt, m);

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = aScale * uPixelRatio * (26.0 / -mv.z) * (1.0 + m * 0.7);
  vTwinkle = 0.55 + 0.45 * sin(uTime * 0.8 + aPhase * 12.0);
  vMix = step(0.86, fract(aPhase * 7.31));
  vMorph = m;
}
`

export const particlesFragment = /* glsl */ `
uniform float uOpacity;
uniform vec3 uBone;
uniform vec3 uAccent;
uniform vec3 uCool;
uniform float uGrade;
varying float vTwinkle;
varying float vMix;
varying float vMorph;

void main(){
  float d = length(gl_PointCoord - 0.5);
  float disc = smoothstep(0.5, 0.12, d);
  vec3 acc = mix(uAccent, uCool, uGrade * 0.85);
  vec3 col = mix(uBone, acc, vMix);
  col = mix(col, uAccent, vMorph * 0.55); // el monograma FA siempre en chartreuse
  float tw = mix(vTwinkle, 0.85 + 0.15 * vTwinkle, vMorph);
  gl_FragColor = vec4(col, disc * uOpacity * tw);
}
`
