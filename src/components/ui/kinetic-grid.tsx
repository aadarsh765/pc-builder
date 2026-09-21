import React, { useEffect, useRef } from 'react';

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  speed: number;
  opacity: number;
}

interface NodePoint {
  baseX: number;
  baseY: number;
  currentX: number;
  currentY: number;
  targetX: number;
  targetY: number;
}

export const KineticGrid: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, targetX: -1000, targetY: -1000, isInside: false });
  const ripplesRef = useRef<Ripple[]>([]);
  const nodesRef = useRef<NodePoint[]>([]);
  const gridDimensionsRef = useRef({ cols: 0, rows: 0, cellSize: 55 });
  const animFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Constants as per RigLab specification
    const INFLUENCE_RADIUS = 260;
    const MAX_WARP = 24;
    const LERP_SPEED = 0.08;

    let width = 0;
    let height = 0;

    const initGrid = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);

      const isMobile = width < 768;
      const cellSize = isMobile ? 75 : 55;

      const cols = Math.ceil(width / cellSize) + 2;
      const rows = Math.ceil(height / cellSize) + 2;
      gridDimensionsRef.current = { cols, rows, cellSize };

      const nodes: NodePoint[] = [];
      const offsetX = (width - (cols - 1) * cellSize) / 2;
      const offsetY = (height - (rows - 1) * cellSize) / 2;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const bx = c * cellSize + offsetX;
          const by = r * cellSize + offsetY;
          nodes.push({
            baseX: bx,
            baseY: by,
            currentX: bx,
            currentY: by,
            targetX: bx,
            targetY: by,
          });
        }
      }
      nodesRef.current = nodes;
    };

    initGrid();

    // Event Handlers
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
      mouseRef.current.isInside = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.isInside = false;
      mouseRef.current.targetX = -1000;
      mouseRef.current.targetY = -1000;
    };

    const handleClick = (e: MouseEvent) => {
      if (prefersReducedMotion) return;
      ripplesRef.current.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        maxRadius: Math.max(width, height) * 0.4,
        speed: 7,
        opacity: 0.8,
      });
    };

    const handleResize = () => {
      initGrid();
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('click', handleClick, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    // Render loop
    const render = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse position LERP
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * LERP_SPEED;
      mouse.y += (mouse.targetY - mouse.y) * LERP_SPEED;

      // Update ripples
      const ripples = ripplesRef.current;
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rip = ripples[i];
        rip.radius += rip.speed;
        rip.opacity = Math.max(0, 1 - rip.radius / rip.maxRadius);
        if (rip.radius >= rip.maxRadius || rip.opacity <= 0) {
          ripples.splice(i, 1);
        }
      }

      // Update node targets & positions
      const nodes = nodesRef.current;
      const { cols, rows } = gridDimensionsRef.current;

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        if (prefersReducedMotion) {
          node.currentX = node.baseX;
          node.currentY = node.baseY;
          continue;
        }

        let warpX = 0;
        let warpY = 0;

        // Cursor Warp Influence
        const dx = node.baseX - mouse.x;
        const dy = node.baseY - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < INFLUENCE_RADIUS && dist > 0.001) {
          const influence = Math.pow(1 - dist / INFLUENCE_RADIUS, 2);
          const force = influence * MAX_WARP;
          warpX += (dx / dist) * force;
          warpY += (dy / dist) * force;
        }

        // Ripple Displacement Influence
        for (let j = 0; j < ripples.length; j++) {
          const rip = ripples[j];
          const rdx = node.baseX - rip.x;
          const rdy = node.baseY - rip.y;
          const rdist = Math.sqrt(rdx * rdx + rdy * rdy);
          const waveDist = Math.abs(rdist - rip.radius);

          if (waveDist < 60 && rdist > 0.001) {
            const waveForce = (1 - waveDist / 60) * rip.opacity * 16;
            warpX += (rdx / rdist) * waveForce;
            warpY += (rdy / rdist) * waveForce;
          }
        }

        node.targetX = node.baseX + warpX;
        node.targetY = node.baseY + warpY;

        // Smooth position interpolation
        node.currentX += (node.targetX - node.currentX) * LERP_SPEED;
        node.currentY += (node.targetY - node.currentY) * LERP_SPEED;
      }

      // Draw Grid Lines
      ctx.lineWidth = 1;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const idx = r * cols + c;
          const curr = nodes[idx];

          // Horizontal connection
          if (c < cols - 1) {
            const right = nodes[idx + 1];
            const distToMouse = Math.min(
              Math.hypot(curr.currentX - mouse.x, curr.currentY - mouse.y),
              Math.hypot(right.currentX - mouse.x, right.currentY - mouse.y)
            );

            let strokeStyle = 'rgba(255, 255, 255, 0.07)';
            if (!prefersReducedMotion && distToMouse < INFLUENCE_RADIUS) {
              const alpha = (1 - distToMouse / INFLUENCE_RADIUS) * 0.35 + 0.07;
              strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            }

            ctx.strokeStyle = strokeStyle;
            ctx.beginPath();
            ctx.moveTo(curr.currentX, curr.currentY);
            ctx.lineTo(right.currentX, right.currentY);
            ctx.stroke();
          }

          // Vertical connection
          if (r < rows - 1) {
            const down = nodes[idx + cols];
            const distToMouse = Math.min(
              Math.hypot(curr.currentX - mouse.x, curr.currentY - mouse.y),
              Math.hypot(down.currentX - mouse.x, down.currentY - mouse.y)
            );

            let strokeStyle = 'rgba(255, 255, 255, 0.07)';
            if (!prefersReducedMotion && distToMouse < INFLUENCE_RADIUS) {
              const alpha = (1 - distToMouse / INFLUENCE_RADIUS) * 0.35 + 0.07;
              strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            }

            ctx.strokeStyle = strokeStyle;
            ctx.beginPath();
            ctx.moveTo(curr.currentX, curr.currentY);
            ctx.lineTo(down.currentX, down.currentY);
            ctx.stroke();
          }
        }
      }

      // Draw Nodes (Dots at intersections)
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const distToMouse = Math.hypot(node.currentX - mouse.x, node.currentY - mouse.y);

        if (!prefersReducedMotion && distToMouse < INFLUENCE_RADIUS) {
          const norm = 1 - distToMouse / INFLUENCE_RADIUS;
          const radius = 1.5 + norm * 1.5;
          const alpha = 0.3 + norm * 0.6;

          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.beginPath();
          ctx.arc(node.currentX, node.currentY, radius, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
          ctx.beginPath();
          ctx.arc(node.currentX, node.currentY, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Draw Ripple Rings
      for (let j = 0; j < ripples.length; j++) {
        const rip = ripples[j];
        ctx.strokeStyle = `rgba(255, 255, 255, ${rip.opacity * 0.35})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      if (!prefersReducedMotion) {
        animFrameIdRef.current = requestAnimationFrame(render);
      }
    };

    if (prefersReducedMotion) {
      render();
    } else {
      animFrameIdRef.current = requestAnimationFrame(render);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current !== null) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
};

export default KineticGrid;
