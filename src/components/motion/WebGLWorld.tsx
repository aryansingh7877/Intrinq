"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function WebGLWorld() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Check accessibility reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const container = containerRef.current;
    const isMobile = window.innerWidth < 768;

    // ── 1. THREE.JS SCENE, CAMERA, RENDERER ─────────────────────────
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060b11, 0.015);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 45;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isMobile,
      powerPreference: "high-performance",
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.2 : 1.6));
    renderer.setClearColor(0x000000, 0); // Transparent background
    container.appendChild(renderer.domElement);

    // ── 2. CIRCULAR GLOWING STARDUST PARTICLES ─────────────────────
    const particleCount = isMobile ? 550 : 1800;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);
    const basePositions = new Float32Array(particleCount * 3);

    const colorGold = new THREE.Color(0xc89a3d);
    const colorPaleGold = new THREE.Color(0xf5e2b8);
    const colorNavyGlow = new THREE.Color(0x1a3354);

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 110;
      const y = (Math.random() - 0.5) * 110;
      const z = (Math.random() - 0.5) * 90;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      basePositions[i * 3] = x;
      basePositions[i * 3 + 1] = y;
      basePositions[i * 3 + 2] = z;

      // Color distribution: 60% gold, 25% pale gold, 15% subtle blue-navy
      const rnd = Math.random();
      const chosenColor = rnd < 0.6 ? colorGold : rnd < 0.85 ? colorPaleGold : colorNavyGlow;

      colors[i * 3] = chosenColor.r;
      colors[i * 3 + 1] = chosenColor.g;
      colors[i * 3 + 2] = chosenColor.b;

      scales[i] = Math.random() * 1.8 + 0.6;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("scale", new THREE.BufferAttribute(scales, 1));

    // Create a circular blurred canvas texture for particles
    const createParticleTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;

      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
      gradient.addColorStop(0.3, "rgba(230, 195, 120, 0.8)");
      gradient.addColorStop(0.7, "rgba(200, 154, 61, 0.25)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);

      const texture = new THREE.CanvasTexture(canvas);
      return texture;
    };

    const particleTexture = createParticleTexture();

    const particleMaterial = new THREE.PointsMaterial({
      size: isMobile ? 1.6 : 2.2,
      map: particleTexture,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.65,
    });

    const particles = new THREE.Points(geometry, particleMaterial);
    scene.add(particles);

    // ── 3. FLOATING 3D FACETED LUXURY PRISMS (OCTAHEDRA) ─────────────
    const prismCount = isMobile ? 5 : 10;
    const prisms: THREE.Mesh[] = [];
    const prismGroup = new THREE.Group();

    const prismGeo = new THREE.OctahedronGeometry(1.4, 0);
    const prismMat = new THREE.MeshBasicMaterial({
      color: 0xc89a3d,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });

    for (let i = 0; i < prismCount; i++) {
      const mesh = new THREE.Mesh(prismGeo, prismMat);
      mesh.position.set(
        (Math.random() - 0.5) * 70,
        (Math.random() - 0.5) * 70,
        (Math.random() - 0.5) * 50
      );
      const s = Math.random() * 1.5 + 0.8;
      mesh.scale.set(s, s, s);
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      prismGroup.add(mesh);
      prisms.push(mesh);
    }
    scene.add(prismGroup);

    // ── 4. INTERACTIVE PHYSICS & ANIMATION STATE ───────────────────
    let mouseX = 0;
    let mouseY = 0;
    let targetCameraX = 0;
    let targetCameraY = 0;
    let targetCameraZ = 45;
    let isPageVisible = true;
    let animId: number;

    const onMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      mouseX = nx;
      mouseY = ny;
      targetCameraX = nx * 5;
      targetCameraY = -ny * 4;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });

    // Handle scroll velocity and depth travel
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;

    const onScroll = () => {
      const currentScroll = window.scrollY;
      const delta = Math.abs(currentScroll - lastScrollY);
      scrollVelocity = Math.min(delta * 0.08, 3.5);
      lastScrollY = currentScroll;
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    // Visibility toggle to avoid wasting GPU cycles
    const onVisibilityChange = () => {
      isPageVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    // Resize handler
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    // ── 5. MAIN RENDER LOOP (60 FPS OPTIMIZED) ─────────────────────
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (!isPageVisible) return;

      const elapsedTime = clock.getElapsedTime();

      // Smooth camera lerp toward target
      camera.position.x += (targetCameraX - camera.position.x) * 0.05;
      camera.position.y += (targetCameraY - camera.position.y) * 0.05;

      // Camera Z reacts to scroll velocity (subtle warp in/out)
      targetCameraZ = 45 - Math.min(scrollVelocity * 4, 12);
      camera.position.z += (targetCameraZ - camera.position.z) * 0.08;
      camera.lookAt(0, 0, 0);

      // Decay scroll velocity smoothly
      scrollVelocity *= 0.92;

      // Rotate particle constellation
      particles.rotation.y = elapsedTime * 0.025;
      particles.rotation.x = Math.sin(elapsedTime * 0.02) * 0.05;

      // Prisms tumbling motion
      prisms.forEach((prism, idx) => {
        const speed = 0.005 + (idx % 3) * 0.003;
        prism.rotation.x += speed;
        prism.rotation.y += speed * 1.3;
        // Bobbing floating height
        prism.position.y += Math.sin(elapsedTime + idx) * 0.015;
      });

      renderer.render(scene, camera);
    };

    animate();

    // ── 6. CLEANUP ON UNMOUNT ──────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);

      geometry.dispose();
      particleMaterial.dispose();
      if (particleTexture) particleTexture.dispose();
      prismGeo.dispose();
      prismMat.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
    />
  );
}
