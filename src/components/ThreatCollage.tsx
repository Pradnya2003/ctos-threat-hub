"use client";

import { useEffect, useRef, useState } from "react";
import { threatActors } from "@/lib/demo-data";
import { useRouter } from "next/navigation";

interface Node {
  id: string;
  name: string;
  category: string;
  status: string;
  description: string;
  image: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  imgElement?: HTMLImageElement;
}

export default function ThreatCollage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const initialNodes: Node[] = [];
    const nodeCount = 80; 

    const loadedImages: Record<string, HTMLImageElement> = {};

    for (let i = 0; i < nodeCount; i++) {
      const realActor = threatActors[i % threatActors.length];
      
      let img: HTMLImageElement | undefined;
      if (typeof window !== 'undefined') {
        if (loadedImages[realActor.profileImage]) {
          img = loadedImages[realActor.profileImage];
        } else {
          img = new Image();
          img.src = realActor.profileImage;
          loadedImages[realActor.profileImage] = img;
        }
      }

      initialNodes.push({
        id: realActor.id,
        name: realActor.name,
        category: realActor.category,
        status: realActor.status,
        description: realActor.description,
        image: realActor.profileImage,
        imgElement: img,
        x: Math.random() * 800,
        y: Math.random() * 400,
        vx: (Math.random() - 0.5) * 0.1, 
        vy: (Math.random() - 0.5) * 0.1,
        radius: 18 + Math.random() * 10, 
        color: "#E05224",
      });
    }
    setNodes(initialNodes);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < node.radius || node.x > canvas.width - node.radius) node.vx *= -1;
        if (node.y < node.radius || node.y > canvas.height - node.radius) node.vy *= -1;

        const isHovered = hoveredNode?.id === node.id;
        const currentRadius = isHovered ? node.radius * 1.2 : node.radius;

        ctx.save();
        ctx.shadowColor = "rgba(0,0,0,0.1)";
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 4;

        ctx.beginPath();
        ctx.arc(node.x, node.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.restore();

        if (node.imgElement && node.imgElement.complete) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(node.x, node.y, currentRadius - 1.5, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(
            node.imgElement, 
            node.x - (currentRadius - 1.5), 
            node.y - (currentRadius - 1.5), 
            (currentRadius - 1.5) * 2, 
            (currentRadius - 1.5) * 2
          );
          ctx.restore();
        } else {
          ctx.beginPath();
          ctx.arc(node.x, node.y, currentRadius - 1.5, 0, Math.PI * 2);
          ctx.fillStyle = node.color;
          ctx.fill();
        }

        if (isHovered) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, currentRadius, 0, Math.PI * 2);
          ctx.strokeStyle = "#E05224";
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [nodes, hoveredNode]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    const found = nodes.find(n => Math.hypot(n.x - x, n.y - y) < n.radius + 5);
    setHoveredNode(found || null);
  };

  const handleClick = () => {
    if (hoveredNode) {
      router.push(`/actor/${hoveredNode.id}`);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && canvasRef.current) {
        canvasRef.current.width = containerRef.current.offsetWidth;
        canvasRef.current.height = 450;
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-col h-full w-full">
      <div className="mb-4">
        <h2 className="text-xl font-black uppercase tracking-tight mb-1">Interactive Threat Landscape</h2>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Global Intelligence Threat Map</p>
      </div>
      
      <div 
        ref={containerRef}
        className="relative flex-1 bg-white rounded-3xl overflow-hidden cursor-crosshair border border-gray-100 shadow-sm"
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        style={{ minHeight: "450px" }}
      >
        {/* Abstract Wave Background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none overflow-hidden">
          <svg className="absolute w-[200%] h-full top-0 left-0 animate-wave" viewBox="0 0 1000 100" preserveAspectRatio="none">
            <path d="M0,50 C150,100 350,0 500,50 C650,100 850,0 1000,50 L1000,100 L0,100 Z" fill="currentColor" />
          </svg>
          <svg className="absolute w-[200%] h-full top-0 left-[-100%] animate-wave-slow opacity-50" viewBox="0 0 1000 100" preserveAspectRatio="none">
            <path d="M0,50 C150,100 350,0 500,50 C650,100 850,0 1000,50 L1000,100 L0,100 Z" fill="currentColor" />
          </svg>
        </div>

        <canvas ref={canvasRef} className="relative z-10" />
        
        {hoveredNode && (
          <div 
            className="absolute z-50 pointer-events-none bg-white p-4 rounded-2xl shadow-2xl border border-gray-50 w-64 transition-transform duration-200"
            style={{ 
              left: Math.min(mousePos.x + 20, (containerRef.current?.offsetWidth || 0) - 280), 
              top: Math.min(mousePos.y + 20, 350) 
            }}
          >
            <h3 className="font-black uppercase tracking-tight text-gray-900">{hoveredNode.name}</h3>
            <div className="flex gap-2 my-2">
              <span className="text-[9px] bg-gray-50 border border-gray-100 px-2 py-0.5 rounded font-black uppercase tracking-widest text-gray-500">
                {hoveredNode.category}
              </span>
              <span className={`text-[9px] px-2 py-0.5 rounded font-black uppercase tracking-widest ${
                hoveredNode.status === 'Active' ? 'bg-green-500 text-white' : 
                hoveredNode.status === 'Emerging' ? 'bg-brand text-white' : 
                'bg-gray-400 text-white'
              }`}>
                {hoveredNode.status}
              </span>
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2 mt-1 italic">{hoveredNode.description}</p>
            <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-brand">
              <span>View Intelligence</span>
              <div className="h-1 w-1 bg-brand rounded-full animate-pulse" />
            </div>
          </div>
        )}

        <style jsx>{`
          @keyframes wave {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes wave-slow {
            0% { transform: translateX(0); }
            100% { transform: translateX(50%); }
          }
          .animate-wave {
            animation: wave 20s linear infinite;
          }
          .animate-wave-slow {
            animation: wave-slow 35s linear infinite;
          }
        `}</style>
      </div>
    </div>
  );
}
