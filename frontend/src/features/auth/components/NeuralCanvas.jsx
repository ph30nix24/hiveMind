import { useEffect, useRef } from "react";

export function NeuralCanvas() {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animId, W, H, nodes;
        const COUNT = 48, MAX_D = 170, SPEED = 0.013;
        const rand = (a, b) => Math.random() * (b - a) + a;
        const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
        const build = () => {
            nodes = Array.from({ length: COUNT }, () => ({
                x: rand(0, W), y: rand(0, H), vx: rand(-0.22, 0.32), vy: rand(-0.22, 0.32),
                r: rand(1.8, 4), phase: rand(0, Math.PI * 2), hue: Math.random() > 0.5 ? 230 : 270,
            }));
        };
        const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; build(); };
        window.addEventListener('resize', resize); resize();
        const sigs = new Map(); let tick = 0;
        const draw = () => {
            tick++; ctx.clearRect(0, 0, W, H);
            for (const n of nodes) {
                n.x += n.vx; n.y += n.vy;
                if (n.x < 0 || n.x > W) n.vx *= -1; if (n.y < 0 || n.y > H) n.vy *= -1;
                n.x = clamp(n.x, 0, W); n.y = clamp(n.y, 0, H);
            }
            for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
                const a = nodes[i], b = nodes[j], dx = b.x - a.x, dy = b.y - a.y, d = Math.sqrt(dx * dx + dy * dy);
                if (d > MAX_D) continue;
                ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
                ctx.strokeStyle = `rgba(90,110,255,${(1 - d / MAX_D) * 0.28})`; ctx.lineWidth = 0.7; ctx.stroke();
                const k = `${i}-${j}`;
                if (!sigs.has(k) && Math.random() < 0.0007) sigs.set(k, 0);
                if (sigs.has(k)) {
                    const t = sigs.get(k), sx = a.x + dx * t, sy = a.y + dy * t;
                    const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, 5);
                    g.addColorStop(0, 'rgba(150,170,255,0.9)'); g.addColorStop(1, 'rgba(100,60,255,0)');
                    ctx.beginPath(); ctx.arc(sx, sy, 5, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
                    sigs.set(k, t + SPEED); if (t + SPEED >= 1) sigs.delete(k);
                }
            }
            for (const n of nodes) {
                const p = 0.55 + 0.45 * Math.sin(tick * 0.038 + n.phase);
                const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 3.5);
                g.addColorStop(0, `hsla(${n.hue},80%,70%,${p * 0.8})`); g.addColorStop(1, `hsla(${n.hue},80%,70%,0)`);
                ctx.beginPath(); ctx.arc(n.x, n.y, n.r * 3.5, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
                ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${n.hue},90%,78%,${p})`; ctx.fill();
            }
            animId = requestAnimationFrame(draw);
        };
        draw();
        return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(animId); };
    }, []);
    return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 w-full h-full" style={{ opacity: 0.38, zIndex: 0 }} />;
}