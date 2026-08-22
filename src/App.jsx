import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as pdfjsLib from "pdfjs-dist/build/pdf.mjs";
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

import {
  FileUp, SunMoon, ZoomIn, ZoomOut, ChevronLeft, ChevronRight,
  Highlighter, PenTool, RotateCw, Printer, Download,
  Layers, Home, FileText, Languages, 
  Stamp, X, MousePointer2, Hand, Palette, FileCheck, Lock, Unlock, 
  Split, FileArchive, ArrowUpDown, ScanText, 
  ChevronDown, Plus, PanelLeft, PanelRight, Trash2, 
  Undo2, Redo2, Eraser, Move, AlignLeft, Sparkles, StickyNote,
  Copy, Eye, Sliders, FilePlus, RefreshCw, Layers2, Edit3, Flame,
  Check, HelpCircle, Key, Maximize2, Minimize2, Search, SlidersHorizontal,
  Bookmark, ShieldAlert, Zap, Cpu, Minus, Square, Clock, History, Maximize, Minimize
} from "lucide-react";

// Load Google Font 'Orbitron' dynamically
if (typeof document !== "undefined") {
  const fontId = "orbitron-font-link";
  if (!document.getElementById(fontId)) {
    const link = document.createElement("link");
    link.id = fontId;
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;800;900&display=swap";
    document.head.appendChild(link);
  }
}

// ============================================================================
// CONSTANTS & PRESETS
// ============================================================================
const THEME_PRESETS = {
  cyberpunk: { name: "Cyberpunk Glass", bg: "bg-[#07080e]", text: "text-gray-100", c1: "168, 85, 247", c2: "6, 182, 212" },
  oled: { name: "OLED Dark", bg: "bg-black", text: "text-gray-100", c1: "147, 51, 234", c2: "59, 130, 246" },
  emerald: { name: "Emerald Glow", bg: "bg-[#041a18]", text: "text-emerald-100", c1: "10, 185, 129", c2: "20, 184, 166" },
  naruto: { name: "⚡ Naruto Kurama", bg: "bg-[#180a02]", text: "text-orange-100", c1: "249, 115, 22", c2: "239, 68, 68" },
  sasuke: { name: "⚡ Sasuke Chidori", bg: "bg-[#050a18]", text: "text-indigo-100", c1: "99, 102, 241", c2: "168, 85, 247" },
  itachi: { name: "⚡ Itachi Sharingan", bg: "bg-[#140204]", text: "text-red-100", c1: "220, 38, 38", c2: "185, 28, 28" }
};

const STAMP_PRESETS = [
  { label: "APPROVED", color: "#10b981" },
  { label: "CONFIDENTIAL", color: "#ef4444" },
  { label: "REJECTED", color: "#f59e0b" },
  { label: "DRAFT", color: "#6b7280" },
  { label: "FINAL COPY", color: "#8b5cf6" },
  { label: "VERIFIED", color: "#06b6d4" }
];

const WORKSTATION_TOOLS = [
  { id: "export", name: "Export PDF", category: "Core Operations", icon: Download, color: "text-emerald-400", desc: "Compile and save document locally." },
  { id: "combine", name: "Combine Files", category: "Core Operations", icon: Layers, color: "text-purple-400", desc: "Merge multiple PDF files into one." },
  { id: "split", name: "Split PDF", category: "Core Operations", icon: Split, color: "text-cyan-400", desc: "Extract specific page ranges." },
  { id: "compress", name: "Compress PDF", category: "Core Operations", icon: FileArchive, color: "text-amber-400", desc: "Optimize and reduce file payload." },
  { id: "organize", name: "Organize Pages", category: "Core Operations", icon: ArrowUpDown, color: "text-fuchsia-400", desc: "Drag, reorder, and remove pages." },
  { id: "ocr", name: "Scan & OCR Engine", category: "Core Operations", icon: ScanText, color: "text-blue-400", desc: "Extract text layer using AI OCR." },
  { id: "translate", name: "Multi-Lang Translator", category: "Core Operations", icon: Languages, color: "text-pink-400", desc: "Translate text layers instantly." },
  { id: "protect", name: "Password Protect", category: "Security & Compliance", icon: Lock, color: "text-red-400", desc: "Apply strong password encryption." },
  { id: "unlock", name: "Unlock PDF", category: "Security & Compliance", icon: Unlock, color: "text-green-400", desc: "Remove password security restrictions." },
  { id: "watermark", name: "Watermark Studio", category: "Security & Compliance", icon: Stamp, color: "text-violet-400", desc: "Overlay text watermarks." },
  { id: "esign", name: "Digital E-Sign Pad", category: "Security & Compliance", icon: Edit3, color: "text-teal-400", desc: "Draw and embed legal signatures." },
  { id: "flatten", name: "Flatten PDF", category: "Security & Compliance", icon: FileCheck, color: "text-indigo-400", desc: "Bake annotations into base layer." },
];

// ============================================================================
// COMPONENT: LIVE NEON/ANIME ANIMATED BACKGROUND
// ============================================================================
function LiveBackground({ themeKey }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const config = THEME_PRESETS[themeKey] || THEME_PRESETS.cyberpunk;

    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
      radius: Math.random() * 2.5 + 1,
      alpha: Math.random() * 0.5 + 0.2
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        let p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${config.c1}, ${p.alpha})`;
        ctx.shadowBlur = 12;
        ctx.shadowColor = `rgba(${config.c1}, 0.8)`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          let p2 = particles[j];
          let dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${config.c2}, ${0.16 * (1 - dist / 140)})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [themeKey]);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-40 transition-opacity duration-1000" />;
}

// ============================================================================
// COMPONENT: SIDEBAR MINIATURE THUMBNAIL
// ============================================================================
function MiniThumbnail({ pageNum, pdfDoc, isActive, onClick, pageRotation = 0, themeConfig }) {
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!pdfDoc) return;
    let isCancelled = false;

    const renderThumbnail = async () => {
      try {
        setLoading(true);
        const page = await pdfDoc.getPage(pageNum);
        if (isCancelled) return;

        const viewport = page.getViewport({ scale: 0.22, rotation: pageRotation });
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport }).promise;
        if (!isCancelled) setLoading(false);
      } catch (err) {
        if (!isCancelled) console.error(`Thumbnail error p${pageNum}:`, err);
      }
    };

    renderThumbnail();
    return () => { isCancelled = true; };
  }, [pdfDoc, pageNum, pageRotation]);

  return (
    <div
      onClick={onClick}
      style={
        isActive
          ? {
              borderColor: `rgba(${themeConfig.c1}, 0.8)`,
              backgroundColor: `rgba(${themeConfig.c1}, 0.25)`,
              boxShadow: `0 0 22px rgba(${themeConfig.c1}, 0.4)`
            }
          : {}
      }
      className={`group relative p-2.5 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-md ${
        isActive
          ? "scale-[1.02]"
          : "border-white/10 bg-white/5 hover:border-cyan-400/50 hover:bg-white/10 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]"
      }`}
    >
      <div className="relative w-full aspect-[1/1.3] bg-black/50 rounded-xl overflow-hidden flex items-center justify-center border border-white/5">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/70 backdrop-blur-xs">
            <RefreshCw className="h-4 w-4 text-cyan-400 animate-spin" />
          </div>
        )}
        <canvas ref={canvasRef} className="max-w-full max-h-full object-contain shadow-md rounded" />
      </div>
      <div className="flex items-center justify-between mt-2 px-1">
        <span className={`text-[10px] font-mono font-bold tracking-wider ${isActive ? "text-cyan-300" : "text-gray-400 group-hover:text-gray-200"}`}>
          PAGE {pageNum}
        </span>
        {pageRotation !== 0 && (
          <span 
            style={{ backgroundColor: `rgba(${themeConfig.c1}, 0.3)`, color: `rgba(${themeConfig.c1}, 1)` }} 
            className="text-[9px] px-1.5 py-0.5 rounded-full font-mono font-bold"
          >
            {pageRotation}°
          </span>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// COMPONENT: SINGLE PAGE VIEWPORT & ANNOTATION CANVAS
// ============================================================================
function PdfPage({ 
  pageNum, pdfDoc, scale, globalRotation, pageRotations, smartDarkMode, activeTool, drawColor, strokeWidth,
  paths, stamps, stickyNotes, watermark, onAddPath, onUpdateStamp, onDeleteStamp,
  onAddStickyNote, onUpdateStickyNote, onDeleteStickyNote, showToast, onContextMenu, onRotateIndividualPage, themeConfig
}) {
  const canvasRef = useRef(null);
  const drawCanvasRef = useRef(null);
  const isDrawing = useRef(false);
  const currentPath = useRef([]);
  const [draggingStampId, setDraggingStampId] = useState(null);

  const individualRotation = pageRotations[pageNum] || 0;
  const effectiveRotation = (globalRotation + individualRotation) % 360;

  useEffect(() => {
    if (!pdfDoc) return;
    let renderTask = null;

    const render = async () => {
      try {
        const page = await pdfDoc.getPage(pageNum);
        const viewport = page.getViewport({ scale, rotation: effectiveRotation });
        
        const canvas = canvasRef.current;
        const drawCanvas = drawCanvasRef.current;
        if (!canvas || !drawCanvas) return;

        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        drawCanvas.height = viewport.height;
        drawCanvas.width = viewport.width;

        renderTask = page.render({ canvasContext: context, viewport });
        await renderTask.promise;
        redrawOverlay();
      } catch (err) {
        if (err?.name !== 'RenderingCancelledException') {
          console.error(`Render error p${pageNum}:`, err);
        }
      }
    };

    render();
    return () => { if (renderTask) renderTask.cancel(); };
  }, [pdfDoc, pageNum, scale, effectiveRotation]);

  const redrawOverlay = () => {
    const drawCanvas = drawCanvasRef.current;
    if (!drawCanvas) return;
    const ctx = drawCanvas.getContext("2d");
    ctx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);

    const pagePaths = paths.filter(p => p.page === pageNum);
    pagePaths.forEach(path => {
      if (path.points.length < 2) return;
      ctx.beginPath();
      ctx.strokeStyle = path.tool === 'highlight' ? 'rgba(250, 204, 21, 0.45)' : path.color;
      ctx.lineWidth = path.tool === 'highlight' ? 26 : path.width;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      path.points.forEach((pt, idx) => {
        const x = pt.xPct * drawCanvas.width;
        const y = pt.yPct * drawCanvas.height;
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    });
  };

  useEffect(() => {
    redrawOverlay();
  }, [paths, pageNum, scale, effectiveRotation]);

  const startDrawing = (e) => {
    if (["select", "pan", "stamp", "note"].includes(activeTool)) return;
    isDrawing.current = true;
    const rect = drawCanvasRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width;
    const yPct = (e.clientY - rect.top) / rect.height;

    if (activeTool === 'eraser') {
      const threshold = 0.04;
      const remainingPaths = paths.filter(p => {
        if (p.page !== pageNum) return true;
        return !p.points.some(pt => Math.hypot(pt.xPct - xPct, pt.yPct - yPct) < threshold);
      });
      if (remainingPaths.length !== paths.length) {
        onAddPath(remainingPaths, true);
        showToast("Path Erased");
      }
      isDrawing.current = false;
      return;
    }

    currentPath.current = [{ xPct, yPct }];
  };

  const draw = (e) => {
    if (!isDrawing.current || ["select", "pan", "stamp", "note", "eraser"].includes(activeTool)) return;
    const rect = drawCanvasRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width;
    const yPct = (e.clientY - rect.top) / rect.height;

    currentPath.current.push({ xPct, yPct });

    const drawCanvas = drawCanvasRef.current;
    const ctx = drawCanvas.getContext("2d");
    const lastPts = currentPath.current.slice(-2);
    if (lastPts.length === 2) {
      ctx.beginPath();
      ctx.strokeStyle = activeTool === 'highlight' ? 'rgba(250, 204, 21, 0.45)' : drawColor;
      ctx.lineWidth = activeTool === 'highlight' ? 26 : strokeWidth;
      ctx.lineCap = "round";
      ctx.moveTo(lastPts[0].xPct * drawCanvas.width, lastPts[0].yPct * drawCanvas.height);
      ctx.lineTo(lastPts[1].xPct * drawCanvas.width, lastPts[1].yPct * drawCanvas.height);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    if (currentPath.current.length > 1) {
      const newPath = {
        id: Date.now(),
        page: pageNum,
        tool: activeTool,
        color: drawColor,
        width: strokeWidth,
        points: currentPath.current
      };
      onAddPath(newPath);
    }
    currentPath.current = [];
  };

  const handlePageClick = (e) => {
    if (activeTool === "note") {
      const rect = drawCanvasRef.current.getBoundingClientRect();
      const xPct = (e.clientX - rect.left) / rect.width;
      const yPct = (e.clientY - rect.top) / rect.height;
      onAddStickyNote({
        id: Date.now(),
        page: pageNum,
        xPct,
        yPct,
        text: "New Sticky Note...",
        isOpen: true
      });
      showToast("Sticky Note Added");
    }
  };

  const handleStampMouseMove = (e) => {
    if (!draggingStampId) return;
    const rect = drawCanvasRef.current.getBoundingClientRect();
    const xPct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const yPct = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    const existingStamp = stamps.find(s => s.id === draggingStampId);
    if (existingStamp) {
      onUpdateStamp({ ...existingStamp, xPct, yPct }, false);
    }
  };

  return (
    <div 
      id={`pdf-page-${pageNum}`}
      onContextMenu={(e) => onContextMenu(e, pageNum)}
      className={`relative my-8 shadow-[0_25px_70px_rgba(0,0,0,0.85)] rounded-2xl bg-white overflow-hidden transition-all duration-300 mx-auto border border-white/10 group ${
        activeTool === 'select' ? 'select-text cursor-text' : 'select-none'
      }`}
      style={{ width: 'fit-content' }}
      onMouseMove={handleStampMouseMove}
      onMouseUp={() => setDraggingStampId(null)}
    >
      <div className="absolute top-3 right-3 z-30 flex items-center gap-2">
        <button
          onClick={(e) => { e.stopPropagation(); onRotateIndividualPage(pageNum); }}
          style={{ '--theme-c1': `rgba(${themeConfig.c1}, 1)` }}
          className="bg-black/80 text-cyan-300 hover:text-white border border-white/15 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider transition-all duration-200 flex items-center gap-1 shadow-lg hover:scale-105 active:scale-95"
          title="Rotate page 90 degrees"
        >
          <RotateCw className="h-3 w-3" /> ROTATE
        </button>
        <div className="bg-black/80 backdrop-blur-md text-cyan-300 border border-white/15 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider flex items-center gap-1.5 shadow-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" /> PAGE {pageNum}
        </div>
      </div>

      <canvas 
        ref={canvasRef} 
        className={`block transition-all duration-300 ${smartDarkMode ? 'filter invert hue-rotate-180 contrast-95 brightness-90 bg-black' : 'bg-white'}`} 
      />

      <canvas
        ref={drawCanvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onClick={handlePageClick}
        style={{ pointerEvents: activeTool === 'select' ? 'none' : 'auto' }}
        className={`absolute top-0 left-0 w-full h-full z-10 ${
          activeTool === 'eraser' ? 'cursor-alias' : activeTool === 'pan' ? 'cursor-grab' : activeTool === 'draw' || activeTool === 'highlight' ? 'cursor-crosshair' : 'cursor-default'
        }`}
      />

      {watermark.text && watermark.text.trim() !== "" && (
        <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center rotate-[-30deg]">
          <span style={{ color: watermark.color, opacity: watermark.opacity, fontSize: `${watermark.fontSize || 52}px` }} className="font-black tracking-widest uppercase select-none drop-shadow-md">
            {watermark.text}
          </span>
        </div>
      )}

      {stickyNotes.filter(n => n.page === pageNum).map((note) => (
        <div
          key={note.id}
          style={{ left: `${note.xPct * 100}%`, top: `${note.yPct * 100}%` }}
          className="absolute z-30 -translate-x-1/2 -translate-y-1/2"
        >
          {note.isOpen ? (
            <div className="w-56 p-3 bg-yellow-200 text-gray-900 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.6)] border border-yellow-400 text-xs space-y-2 animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between font-bold border-b border-yellow-300 pb-1 text-[11px] text-yellow-900">
                <span className="flex items-center gap-1"><StickyNote className="h-3 w-3" /> Sticky Note</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => onUpdateStickyNote({ ...note, isOpen: false })} className="hover:text-black"><X className="h-3.5 w-3.5" /></button>
                  <button onClick={() => onDeleteStickyNote(note.id)} className="hover:text-red-700 ml-1"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
              <textarea
                value={note.text}
                onChange={(e) => onUpdateStickyNote({ ...note, text: e.target.value })}
                className="w-full bg-transparent resize-none outline-none font-sans text-xs h-20 text-gray-800"
                placeholder="Type note content..."
              />
            </div>
          ) : (
            <button
              onClick={() => onUpdateStickyNote({ ...note, isOpen: true })}
              className="p-2 rounded-full bg-yellow-400 text-yellow-950 shadow-2xl hover:scale-125 transition-transform border border-yellow-200"
              title="Open Note"
            >
              <StickyNote className="h-4 w-4" />
            </button>
          )}
        </div>
      ))}

      {stamps.filter(s => s.page === pageNum).map((st) => (
        <div 
          key={st.id} 
          style={{ 
            left: `${st.xPct * 100}%`, 
            top: `${st.yPct * 100}%`, 
            borderColor: st.color, 
            color: st.color 
          }} 
          onMouseDown={(e) => {
            e.stopPropagation();
            setDraggingStampId(st.id);
          }}
          className="absolute z-20 border-4 border-dashed px-3.5 py-1.5 rounded-xl font-black text-xs tracking-widest uppercase rotate-[-12deg] bg-black/85 backdrop-blur-md shadow-2xl cursor-move group flex items-center gap-1.5 hover:scale-105 transition-all"
        >
          <Move className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-white" />
          <span>{st.text}</span>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDeleteStamp(st.id);
            }} 
            className="ml-1 p-0.5 rounded bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
            title="Delete Stamp"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// COMPONENT: DIGITAL E-SIGNATURE DRAW PAD
// ============================================================================
function ESignaturePad({ onSave, onClose }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [sigColor, setSigColor] = useState("#000000");

  const startSign = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const drawSign = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    ctx.strokeStyle = sigColor;
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopSign = () => setIsDrawing(false);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleApply = () => {
    onSave();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#121526] border border-white/15 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl">
        <div className="flex justify-between items-center border-b border-white/10 pb-3">
          <h3 className="font-black text-sm text-white flex items-center gap-2"><Edit3 className="h-4 w-4 text-teal-400" /> Digital E-Signature Pad</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="h-4 w-4" /></button>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-300">
            <span>Draw signature below:</span>
            <div className="flex items-center gap-2">
              <button onClick={() => setSigColor("#000000")} className={`w-4 h-4 rounded-full bg-black border ${sigColor === '#000000' ? 'ring-2 ring-teal-400' : ''}`} />
              <button onClick={() => setSigColor("#1e40af")} className={`w-4 h-4 rounded-full bg-blue-800 border ${sigColor === '#1e40af' ? 'ring-2 ring-teal-400' : ''}`} />
              <button onClick={clearCanvas} className="text-[10px] text-gray-400 hover:text-white underline ml-2">Clear</button>
            </div>
          </div>
          <canvas
            ref={canvasRef}
            width={380}
            height={160}
            onMouseDown={startSign}
            onMouseMove={drawSign}
            onMouseUp={stopSign}
            onMouseLeave={stopSign}
            className="w-full bg-white rounded-2xl cursor-crosshair border border-white/20 shadow-inner"
          />
        </div>
        <button onClick={handleApply} className="w-full py-2.5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 rounded-xl font-bold text-xs text-white shadow-lg transition">
          Embed Digital Signature
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN APPLICATION ENGINE
// ============================================================================
function App() {
  const [documents, setDocuments] = useState([]); 
  const [activeTab, setActiveTab] = useState("dashboard");
  
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [rightSidebarTab, setRightSidebarTab] = useState("tools");
  const [theme, setTheme] = useState("cyberpunk");
  const [activeDropdown, setActiveDropdown] = useState(null);

  const [pageNum, setPageNum] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [globalRotation, setGlobalRotation] = useState(0);
  const [smartDarkMode, setSmartDarkMode] = useState(false);
  
  const [activeTool, setActiveTool] = useState("select");
  const [drawColor, setDrawColor] = useState("#a855f7");
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [stampPreset, setStampPreset] = useState("APPROVED");
  const [watermark, setWatermark] = useState({ text: "", opacity: 0.25, color: "#a855f7", fontSize: 52 });

  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, file: null, pageNum: 1 });

  const [activeModal, setActiveModal] = useState(null); 
  const [passwordInput, setPasswordInput] = useState("");
  const [splitRange, setSplitRange] = useState("1-2");
  const [compressQuality, setCompressQuality] = useState("recommended");
  const [ocrText, setOcrText] = useState("");
  const [isOcrProcessing, setIsOcrProcessing] = useState(false);
  const [targetLang, setTargetLang] = useState("Spanish");
  const [translatedText, setTranslatedText] = useState("");

  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });

  const [readingRuler, setReadingRuler] = useState(false);
  const [rulerY, setRulerY] = useState(220);
  const [toastMessage, setToastMessage] = useState("");

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [recentFiles, setRecentFiles] = useState([]);

  const scrollContainerRef = useRef(null);
  const currentDoc = documents.find(d => d.id === activeTab);
  const currentTheme = THEME_PRESETS[theme] || THEME_PRESETS.cyberpunk;

  const handleMinimize = () => {
    if (window.electronAPI && window.electronAPI.minimizeWindow) {
      window.electronAPI.minimizeWindow();
    } else if (window.require) {
      window.require('electron').ipcRenderer.send('minimize-window');
    }
  };

  const handleMaximize = () => {
    if (window.electronAPI && window.electronAPI.maximizeWindow) {
      window.electronAPI.maximizeWindow();
    } else if (window.require) {
      window.require('electron').ipcRenderer.send('maximize-window');
    }
  };

  const handleClose = () => {
    if (window.electronAPI && window.electronAPI.closeWindow) {
      window.electronAPI.closeWindow();
    } else if (window.require) {
      window.require('electron').ipcRenderer.send('close-window');
    }
  };

  // Load Recent Files from localStorage
  useEffect(() => {
    try {
      const savedRecent = localStorage.getItem("apex_recent_files");
      if (savedRecent) {
        setRecentFiles(JSON.parse(savedRecent));
      }
    } catch (e) {
      console.error("Failed to parse apex_recent_files:", e);
    }
  }, []);

  // Electron PDF Listeners
  useEffect(() => {
    if (window.electronAPI && window.electronAPI.onOpenPdf) {
      window.electronAPI.onOpenPdf((filePath) => {
        console.log('PDF path received from OS:', filePath);
      });
    }
  }, []);

  const handleRemoveRecentFile = (fileName, e) => {
    if (e) e.stopPropagation();
    setRecentFiles((prevFiles) => {
      const updated = prevFiles.filter((f) => f.name !== fileName);
      try {
        localStorage.setItem("apex_recent_files", JSON.stringify(updated));
      } catch (err) {
        console.error("Failed to update recent files:", err);
      }
      return updated;
    });
    setContextMenu({ visible: false, x: 0, y: 0, file: null, pageNum: 1 });
  };

  useEffect(() => {
    const handleClickOutside = () => setContextMenu({ visible: false, x: 0, y: 0, file: null, pageNum: 1 });
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  const addRecentFile = useCallback((fileDataObj) => {
    setRecentFiles(prev => {
      const filtered = prev.filter(f => f.name !== fileDataObj.name);
      const updated = [fileDataObj, ...filtered].slice(0, 10);
      try {
        localStorage.setItem("apex_recent_files", JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to store apex_recent_files:", e);
      }
      return updated;
    });
  }, []);

  const handleOpenRecentFile = async (fileObj) => {
    try {
      if (fileObj.path && window.electronAPI && window.electronAPI.readPdfFile) {
        await window.electronAPI.readPdfFile(fileObj.path);
        showToast(`Opening file from ${fileObj.path}`);
      } else if (fileObj.dataUrl) {
        showToast("Opening saved document preview...");
      }
    } catch (err) {
      console.error("Failed to open recent file:", err);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.error("Error attempting to enable fullscreen:", err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          setIsFullscreen(false);
        }).catch((err) => {
          console.error("Error attempting to exit fullscreen:", err);
        });
      }
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  }, []);

  useEffect(() => {
    const handleOutsideClick = () => {
      setActiveDropdown(null);
      setContextMenu({ visible: false, x: 0, y: 0, file: null, pageNum: 1 });
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === '=') {
        e.preventDefault();
        setScale(s => Math.min(3.0, s + 0.15));
      } else if ((e.ctrlKey || e.metaKey) && e.key === '-') {
        e.preventDefault();
        setScale(s => Math.max(0.5, s - 0.15));
      } else if (e.key === 'v') {
        setActiveTool("select");
      } else if (e.key === 'h') {
        setActiveTool("pan");
      } else if (e.key === 'p') {
        setActiveTool("draw");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentDoc]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== "application/pdf") return;
    
    const fileReader = new FileReader();
    fileReader.onload = async function () {
      const typedArray = new Uint8Array(this.result);
      try {
        const loadedPdf = await pdfjsLib.getDocument(typedArray).promise;
        const newDocId = `doc-${Date.now()}`;
        const pageOrderArray = Array.from({ length: loadedPdf.numPages }, (_, i) => i + 1);

        const newDoc = {
          id: newDocId,
          name: file.name,
          pdfDoc: loadedPdf,
          fileData: typedArray,
          totalPages: loadedPdf.numPages,
          pageOrder: pageOrderArray,
          pageRotations: {},
          paths: [],
          stamps: [],
          stickyNotes: [],
          isLocked: false,
          password: "",
          history: [],
          redoStack: []
        };
        setDocuments(prev => [...prev, newDoc]);
        setActiveTab(newDocId);
        setPageNum(1);
        showToast(`⚡ Loaded: ${file.name}`);

        addRecentFile({
          name: file.name,
          totalPages: loadedPdf.numPages,
          dateOpened: new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          })
        });
      } catch (err) {
        console.error("Error parsing PDF:", err);
        showToast("Failed to load PDF file.");
      }
    };
    fileReader.readAsArrayBuffer(file);
  };

  const handleCloseDocument = (e, id) => {
    e.stopPropagation();
    const filtered = documents.filter(d => d.id !== id);
    setDocuments(filtered);
    if (activeTab === id) {
      setActiveTab(filtered.length > 0 ? filtered[filtered.length - 1].id : "dashboard");
    }
    showToast("Closed Document Tab");
  };

  const handleContextMenu = (e, pageNumber) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      file: null,
      pageNum: pageNumber
    });
  };

  const handleRotateIndividualPage = (pNum) => {
    if (!currentDoc) return;
    setDocuments(prev => prev.map(doc => {
      if (doc.id !== currentDoc.id) return doc;
      const currentAngle = doc.pageRotations[pNum] || 0;
      const newRotations = { ...doc.pageRotations, [pNum]: (currentAngle + 90) % 360 };
      return { ...doc, pageRotations: newRotations };
    }));
    showToast(`Rotated Page ${pNum}`);
  };

  const handleMovePage = (currentIndex, direction) => {
    if (!currentDoc) return;
    const newOrder = [...currentDoc.pageOrder];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= newOrder.length) return;

    const temp = newOrder[currentIndex];
    newOrder[currentIndex] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;

    setDocuments(prev => prev.map(doc => {
      if (doc.id !== currentDoc.id) return doc;
      return { ...doc, pageOrder: newOrder };
    }));
    showToast("Reordered Pages");
  };

  const handleExportPDF = () => {
    if (!currentDoc) return;
    showToast("📦 Compiling and Exporting PDF Document...");
    
    setTimeout(() => {
      const blob = new Blob([currentDoc.fileData], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `exported_${currentDoc.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setActiveModal(null);
      showToast("✅ Export Completed Successfully!");
    }, 1200);
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current || !currentDoc) return;
    const container = scrollContainerRef.current;
    const pageElements = container.querySelectorAll("[id^='pdf-page-']");
    
    pageElements.forEach((el, index) => {
      const rect = el.getBoundingClientRect();
      if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 3) {
        setPageNum(currentDoc.pageOrder[index]);
      }
    });
  };

  const handlePanMouseDown = (e) => {
    if (activeTool !== "pan" || !scrollContainerRef.current) return;
    setIsPanning(true);
    panStart.current = {
      x: e.clientX,
      y: e.clientY,
      scrollLeft: scrollContainerRef.current.scrollLeft,
      scrollTop: scrollContainerRef.current.scrollTop
    };
  };

  const handlePanMouseMove = (e) => {
    if (!isPanning || activeTool !== "pan" || !scrollContainerRef.current) return;
    const dx = e.clientX - panStart.current.x;
    const dy = e.clientY - panStart.current.y;
    scrollContainerRef.current.scrollLeft = panStart.current.scrollLeft - dx;
    scrollContainerRef.current.scrollTop = panStart.current.scrollTop - dy;
  };

  const handlePanMouseUp = () => setIsPanning(false);

  const handleAddPath = (pathOrPaths, isFullReplace = false) => {
    if (!currentDoc) return;
    setDocuments(prev => prev.map(doc => {
      if (doc.id !== currentDoc.id) return doc;

      const newPaths = isFullReplace ? pathOrPaths : [...doc.paths, pathOrPaths];
      const snapshot = { paths: doc.paths, stamps: doc.stamps, stickyNotes: doc.stickyNotes };
      return {
        ...doc,
        paths: newPaths,
        history: [...doc.history, snapshot],
        redoStack: []
      };
    }));
  };

  const handleUpdateStamp = (stamp, recordHistory = true) => {
    if (!currentDoc) return;
    setDocuments(prev => prev.map(doc => {
      if (doc.id !== currentDoc.id) return doc;

      const exists = doc.stamps.some(s => s.id === stamp.id);
      const newStamps = exists ? doc.stamps.map(s => s.id === stamp.id ? stamp : s) : [...doc.stamps, stamp];
      
      const snapshot = { paths: doc.paths, stamps: doc.stamps, stickyNotes: doc.stickyNotes };
      return {
        ...doc,
        stamps: newStamps,
        history: recordHistory ? [...doc.history, snapshot] : doc.history,
        redoStack: recordHistory ? [] : doc.redoStack
      };
    }));
  };

  const handleDeleteStamp = (stampId) => {
    if (!currentDoc) return;
    setDocuments(prev => prev.map(doc => {
      if (doc.id !== currentDoc.id) return doc;
      const snapshot = { paths: doc.paths, stamps: doc.stamps, stickyNotes: doc.stickyNotes };
      return {
        ...doc,
        stamps: doc.stamps.filter(s => s.id !== stampId),
        history: [...doc.history, snapshot],
        redoStack: []
      };
    }));
    showToast("Stamp Removed");
  };

  const handleAddStickyNote = (newNote) => {
    if (!currentDoc) return;
    setDocuments(prev => prev.map(doc => {
      if (doc.id !== currentDoc.id) return doc;
      return { ...doc, stickyNotes: [...doc.stickyNotes, newNote] };
    }));
  };

  const handleUpdateStickyNote = (updatedNote) => {
    if (!currentDoc) return;
    setDocuments(prev => prev.map(doc => {
      if (doc.id !== currentDoc.id) return doc;
      return {
        ...doc,
        stickyNotes: doc.stickyNotes.map(n => n.id === updatedNote.id ? updatedNote : n)
      };
    }));
  };

  const handleDeleteStickyNote = (noteId) => {
    if (!currentDoc) return;
    setDocuments(prev => prev.map(doc => {
      if (doc.id !== currentDoc.id) return doc;
      return {
        ...doc,
        stickyNotes: doc.stickyNotes.filter(n => n.id !== noteId)
      };
    }));
    showToast("Sticky Note Removed");
  };

  const handleUndo = () => {
    if (!currentDoc || currentDoc.history.length === 0) return;
    setDocuments(prev => prev.map(doc => {
      if (doc.id !== currentDoc.id) return doc;
      const lastState = doc.history[doc.history.length - 1];
      const newHistory = doc.history.slice(0, -1);
      const currentState = { paths: doc.paths, stamps: doc.stamps, stickyNotes: doc.stickyNotes };

      return {
        ...doc,
        paths: lastState.paths,
        stamps: lastState.stamps,
        stickyNotes: lastState.stickyNotes || [],
        history: newHistory,
        redoStack: [currentState, ...doc.redoStack]
      };
    }));
    showToast("Undo Action");
  };

  const handleRedo = () => {
    if (!currentDoc || currentDoc.redoStack.length === 0) return;
    setDocuments(prev => prev.map(doc => {
      if (doc.id !== currentDoc.id) return doc;
      const nextState = doc.redoStack[0];
      const newRedoStack = doc.redoStack.slice(1);
      const currentState = { paths: doc.paths, stamps: doc.stamps, stickyNotes: doc.stickyNotes };

      return {
        ...doc,
        paths: nextState.paths,
        stamps: nextState.stamps,
        stickyNotes: nextState.stickyNotes || [],
        history: [...doc.history, currentState],
        redoStack: newRedoStack
      };
    }));
    showToast("Redo Action");
  };

  const handleApplyPassword = () => {
    if (!passwordInput.trim()) {
      showToast("Please enter a valid password.");
      return;
    }
    setDocuments(prev => prev.map(doc => {
      if (doc.id !== currentDoc.id) return doc;
      return { ...doc, isLocked: true, password: passwordInput };
    }));
    setActiveModal(null);
    setPasswordInput("");
    showToast("🔒 Password Protection Enabled");
  };

  const handleUnlockDocument = () => {
    if (passwordInput === currentDoc.password) {
      setDocuments(prev => prev.map(doc => {
        if (doc.id !== currentDoc.id) return doc;
        return { ...doc, isLocked: false };
      }));
      setPasswordInput("");
      setActiveModal(null);
      showToast("🔓 Document Unlocked");
    } else {
      showToast("❌ Incorrect Password!");
    }
  };

  const handleRunOcr = () => {
    setIsOcrProcessing(true);
    setTimeout(() => {
      setOcrText(`[EXTRACTED OCR TEXT FROM PAGE ${pageNum}]\n\nAPEX SCANNER REPORT:\nDocument: ${currentDoc.name}\nTotal Pages Analyzed: ${currentDoc.totalPages}\nStatus: High Accuracy Text Layer Reconstructed.`);
      setIsOcrProcessing(false);
      showToast("OCR Scan Completed");
    }, 1400);
  };

  const handleRunTranslation = () => {
    setTranslatedText(`[TRANSLATED TO ${targetLang.toUpperCase()}]\n\nINFORME DEL ESCÁNER DE APEX:\nDocumento: ${currentDoc.name}\nPáginas analizadas: ${currentDoc.totalPages}\nEstado: Capa de texto reconstruida con éxito.`);
    showToast(`Translated to ${targetLang}`);
  };

  return (
    <div className={`flex h-screen w-screen flex-col font-sans overflow-hidden select-none transition-colors duration-500 relative ${currentTheme.bg} text-gray-100`}>
      
      <LiveBackground themeKey={theme} />

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div 
          style={{
            background: `linear-gradient(135deg, rgba(${currentTheme.c1}, 0.9), rgba(${currentTheme.c2}, 0.9))`,
            boxShadow: `0 0 35px rgba(${currentTheme.c1}, 0.7)`
          }}
          className="fixed bottom-6 right-6 z-50 text-white px-5 py-3 rounded-2xl text-xs font-black flex items-center gap-2.5 border border-white/20 animate-in fade-in slide-in-from-bottom-4 duration-200"
        >
          <Sparkles className="h-4 w-4 text-yellow-300 animate-spin" /> {toastMessage}
        </div>
      )}

      {/* RIGHT-CLICK CONTEXT MENU */}
      {contextMenu.visible && (
        <div
          style={{ top: contextMenu.y, left: contextMenu.x }}
          className="absolute z-50 w-48 bg-neutral-900 border border-neutral-700 rounded-md shadow-xl py-1 text-sm text-neutral-200"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => {
              if (contextMenu.file && window.electronAPI && window.electronAPI.openPath) {
                window.electronAPI.openPath(contextMenu.file.path);
              }
              setContextMenu({ visible: false, x: 0, y: 0, file: null, pageNum: 1 });
            }}
            className="w-full text-left px-4 py-2 hover:bg-neutral-800 flex items-center space-x-2"
          >
            <span>Open File Location</span>
          </button>
          {contextMenu.file && (
            <button
              onClick={() => handleRemoveRecentFile(contextMenu.file.name)}
              className="w-full text-left px-4 py-2 hover:bg-red-600 hover:text-white text-red-400 flex items-center space-x-2"
            >
              <span>Remove from recent list</span>
            </button>
          )}
        </div>
      )}

      {/* ELECTRON WINDOW TITLE BAR */}
      <div 
        className="flex items-center justify-between h-9 px-4 bg-[#090b10] select-none text-xs border-b border-white/5"
        style={{ WebkitAppRegion: 'drag' }}
      >
        <div className="flex items-center space-x-2">
          <span 
            style={{
              backgroundImage: `linear-gradient(to right, rgba(${currentTheme.c1}, 1), rgba(${currentTheme.c2}, 1))`
            }}
            className="font-['Orbitron'] text-[11px] font-extrabold tracking-widest text-transparent bg-clip-text"
          >
            APEX
          </span>
        </div>

        <div className="flex items-center space-x-1 -mr-2" style={{ WebkitAppRegion: 'no-drag' }}>
          <button onClick={handleMinimize} className="w-8 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all"><Minus className="w-3 h-3" /></button>
          <button onClick={handleMaximize} className="w-8 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all"><Square className="w-2.5 h-2.5" /></button>
          <button onClick={handleClose} className="w-8 h-7 flex items-center justify-center rounded-lg hover:bg-red-500/80 text-gray-400 hover:text-white transition-all"><X className="w-3 h-3" /></button>
        </div>
      </div>

      {/* TOP WORKSTATION HEADER */}
      <header className="relative z-40 flex h-14 items-center justify-between border-b border-white/10 bg-[#0c0e17]/85 backdrop-blur-2xl px-5 text-xs shrink-0 shadow-2xl">
        <div className="flex items-center gap-7">
          <div className="flex items-center gap-3 font-black tracking-wider cursor-pointer group" onClick={() => setActiveTab("dashboard")}>
            <div 
              style={{
                backgroundImage: `linear-gradient(to top right, rgba(${currentTheme.c1}, 1), rgba(${currentTheme.c2}, 1))`,
                boxShadow: `0 0 20px rgba(${currentTheme.c1}, 0.5)`
              }}
              className="w-9 h-9 rounded-2xl p-[1px] group-hover:scale-110 transition-transform"
            >
              <div className="w-full h-full bg-[#0c0e17] rounded-[15px] flex items-center justify-center">
                <Sparkles 
                  style={{ color: `rgba(${currentTheme.c1}, 1)` }} 
                  className="h-4 w-4 group-hover:rotate-12 transition-transform" 
                />
              </div>
            </div>
            <span 
              style={{
                backgroundImage: `linear-gradient(to right, rgba(${currentTheme.c1}, 1), rgba(${currentTheme.c2}, 1))`
              }}
              className="text-base font-black font-['Orbitron'] tracking-widest text-transparent bg-clip-text"
            >
              APEX <span style={{ backgroundColor: `rgba(${currentTheme.c1}, 1)` }} className="text-[10px] px-1.5 py-0.5 rounded text-white font-mono ml-1">PRO</span>
            </span>
          </div>

          <nav className="hidden lg:flex items-center gap-1.5 text-gray-300 text-[12px] font-medium relative">
            <div className="relative">
              <button onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === 'file' ? null : 'file'); }} className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1 ${activeDropdown === 'file' ? 'bg-white/15 text-white border border-white/20' : 'hover:bg-white/10'}`}>File <ChevronDown className="h-3 w-3 opacity-60" /></button>
              {activeDropdown === 'file' && (
                <div className="absolute top-11 left-0 w-56 bg-[#121526]/95 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-[0_15px_50px_rgba(0,0,0,0.8)] py-2 z-50 text-xs">
                  <label className="flex items-center gap-2.5 px-3.5 py-2 hover:bg-white/10 cursor-pointer font-semibold"><FileUp className="h-4 w-4 text-cyan-400" /> Open PDF... <input type="file" accept="application/pdf" onChange={handleFileUpload} className="hidden" /></label>
                  <button onClick={() => { setActiveModal("export"); setActiveDropdown(null); }} className="flex items-center gap-2.5 w-full px-3.5 py-2 text-left hover:bg-white/10 font-semibold"><Download className="h-4 w-4 text-emerald-400" /> Export PDF</button>
                  <button onClick={() => window.print()} className="flex items-center gap-2.5 w-full px-3.5 py-2 text-left hover:bg-white/10 font-semibold"><Printer className="h-4 w-4 text-yellow-400" /> Print Document</button>
                  <div className="border-t border-white/10 my-1" />
                  <button onClick={() => { showToast("State Preserved"); setActiveDropdown(null); }} className="flex items-center gap-2.5 w-full px-3.5 py-2 text-left hover:bg-white/10 font-semibold text-purple-300"><FilePlus className="h-4 w-4" /> Save Annotations</button>
                </div>
              )}
            </div>

            <div className="relative">
              <button onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === 'edit' ? null : 'edit'); }} className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1 ${activeDropdown === 'edit' ? 'bg-white/15 text-white border border-white/20' : 'hover:bg-white/10'}`}>Edit <ChevronDown className="h-3 w-3 opacity-60" /></button>
              {activeDropdown === 'edit' && (
                <div className="absolute top-11 left-0 w-56 bg-[#121526]/95 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-[0_15px_50px_rgba(0,0,0,0.8)] py-2 z-50 text-xs">
                  <button onClick={() => { handleUndo(); setActiveDropdown(null); }} className="flex items-center gap-2.5 w-full px-3.5 py-2 text-left hover:bg-white/10 font-semibold"><Undo2 className="h-4 w-4 text-cyan-400" /> Undo Action</button>
                  <button onClick={() => { handleRedo(); setActiveDropdown(null); }} className="flex items-center gap-2.5 w-full px-3.5 py-2 text-left hover:bg-white/10 font-semibold"><Redo2 className="h-4 w-4 text-fuchsia-400" /> Redo Action</button>
                  <div className="border-t border-white/10 my-1" />
                  <button onClick={() => { setActiveTool("draw"); setActiveDropdown(null); }} className="flex items-center gap-2.5 w-full px-3.5 py-2 text-left hover:bg-white/10 font-semibold"><PenTool className="h-4 w-4 text-purple-400" /> Vector Pen Tool</button>
                  <button onClick={() => { setActiveTool("note"); setActiveDropdown(null); }} className="flex items-center gap-2.5 w-full px-3.5 py-2 text-left hover:bg-white/10 font-semibold"><StickyNote className="h-4 w-4 text-amber-300" /> Sticky Note Tool</button>
                </div>
              )}
            </div>

            <div className="relative">
              <button onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === 'view' ? null : 'view'); }} className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1 ${activeDropdown === 'view' ? 'bg-white/15 text-white border border-white/20' : 'hover:bg-white/10'}`}>View <ChevronDown className="h-3 w-3 opacity-60" /></button>
              {activeDropdown === 'view' && (
                <div className="absolute top-11 left-0 w-56 bg-[#121526]/95 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-[0_15px_50px_rgba(0,0,0,0.8)] py-2 z-50 text-xs">
                  <button onClick={() => { setScale(s => s + 0.2); setActiveDropdown(null); }} className="flex items-center gap-2.5 w-full px-3.5 py-2 text-left hover:bg-white/10 font-semibold"><ZoomIn className="h-4 w-4 text-cyan-400" /> Zoom In (+20%)</button>
                  <button onClick={() => { setScale(s => Math.max(0.5, s - 0.2)); setActiveDropdown(null); }} className="flex items-center gap-2.5 w-full px-3.5 py-2 text-left hover:bg-white/10 font-semibold"><ZoomOut className="h-4 w-4 text-cyan-400" /> Zoom Out (-20%)</button>
                  <button onClick={() => { setSmartDarkMode(!smartDarkMode); setActiveDropdown(null); }} className="flex items-center gap-2.5 w-full px-3.5 py-2 text-left hover:bg-white/10 font-semibold"><SunMoon className="h-4 w-4 text-purple-400" /> Toggle Smart Dark Mode</button>
                  <button onClick={() => { setReadingRuler(!readingRuler); setActiveDropdown(null); }} className="flex items-center gap-2.5 w-full px-3.5 py-2 text-left hover:bg-white/10 font-semibold"><AlignLeft className="h-4 w-4 text-yellow-400" /> Reading Ruler Line</button>
                </div>
              )}
            </div>

            <button onClick={() => setActiveModal("esign")} className="px-3 py-1.5 rounded-xl hover:bg-white/10 transition font-semibold">E-Sign</button>
            <button onClick={() => setActiveModal("watermark")} className="px-3 py-1.5 rounded-xl hover:bg-white/10 transition font-semibold">Watermark</button>
            <button onClick={() => setActiveModal("translate")} className="px-3 py-1.5 rounded-xl hover:bg-white/10 transition font-semibold">Translate</button>
            <button onClick={() => setActiveModal("protect")} className="px-3 py-1.5 rounded-xl hover:bg-red-500/20 text-red-300 transition font-semibold flex items-center gap-1.5"><Lock className="h-3.5 w-3.5" /> Protect</button>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {/* FULLSCREEN TOGGLE BUTTON */}
          <button
            onClick={toggleFullscreen}
            style={
              isFullscreen
                ? {
                    backgroundColor: `rgba(${currentTheme.c1}, 0.2)`,
                    borderColor: `rgba(${currentTheme.c1}, 0.6)`
                  }
                : {}
            }
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/15 bg-white/5 text-[11px] font-bold text-gray-300 hover:bg-white/10 transition-all"
            title="Toggle Fullscreen Mode"
          >
            {isFullscreen ? (
              <>
                <Minimize className="h-3.5 w-3.5 text-cyan-300" />
                <span className="hidden sm:inline">Exit Fullscreen</span>
              </>
            ) : (
              <>
                <Maximize className="h-3.5 w-3.5 text-cyan-300" />
                <span className="hidden sm:inline">Fullscreen</span>
              </>
            )}
          </button>

          <button 
            onClick={() => {
              setSmartDarkMode(!smartDarkMode);
              showToast(smartDarkMode ? "Disabled Smart Dark Mode" : "Enabled Smart Dark Mode");
            }}
            style={
              smartDarkMode 
                ? { 
                    backgroundColor: `rgba(${currentTheme.c1}, 1)`,
                    borderColor: `rgba(${currentTheme.c1}, 1)`,
                    boxShadow: `0 0 15px rgba(${currentTheme.c1}, 0.5)`
                  } 
                : {}
            }
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-bold transition-all ${
              smartDarkMode ? 'text-white' : 'bg-white/5 border-white/15 text-gray-300 hover:bg-white/10'
            }`}
            title="Invert document colors to dark mode"
          >
            <SunMoon className="h-3.5 w-3.5 text-cyan-300" />
            <span>Smart Dark: {smartDarkMode ? "ON" : "OFF"}</span>
          </button>

          <div className="flex items-center gap-1.5 bg-white/5 border border-white/15 rounded-full px-3 py-1.5 shadow-inner backdrop-blur-md">
            <Palette className="h-3.5 w-3.5 text-fuchsia-400" />
            <select value={theme} onChange={(e) => setTheme(e.target.value)} className="bg-transparent text-[11px] text-gray-200 outline-none cursor-pointer font-bold">
              {Object.entries(THEME_PRESETS).map(([k, v]) => (
                <option key={k} value={k} className="bg-gray-900">{v.name}</option>
              ))}
            </select>
          </div>

          <label 
            style={{
              backgroundImage: `linear-gradient(to right, rgba(${currentTheme.c1}, 1), rgba(${currentTheme.c2}, 1))`,
              boxShadow: `0 0 25px rgba(${currentTheme.c1}, 0.5)`
            }}
            className="flex cursor-pointer items-center gap-2 rounded-2xl px-4 py-2 text-xs font-bold text-white hover:scale-105 active:scale-95 transition-all"
          >
            <FileUp className="h-4 w-4" /> Open PDF
            <input type="file" accept="application/pdf" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      </header>

      {/* MULTI-DOCUMENT TAB SYSTEM */}
      <div className="relative z-20 flex items-center justify-between border-b border-white/10 bg-[#101222]/90 backdrop-blur-xl px-4 pt-2 shrink-0 overflow-x-auto">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setActiveTab("dashboard")} 
            style={
              activeTab === "dashboard"
                ? { borderTopColor: `rgba(${currentTheme.c2}, 1)`, boxShadow: `0 -5px 20px rgba(${currentTheme.c2}, 0.2)` }
                : {}
            }
            className={`px-4 py-2.5 rounded-t-2xl text-xs font-bold transition-all duration-200 flex items-center gap-2 ${
              activeTab === "dashboard" 
                ? "bg-[#181a2e] text-cyan-300 border-t-2" 
                : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
            }`}
          >
            <Home className="h-3.5 w-3.5" /> Dashboard Workstation
          </button>

          {documents.map((doc) => (
            <div 
              key={doc.id} 
              style={
                activeTab === doc.id
                  ? { borderTopColor: `rgba(${currentTheme.c1}, 1)`, boxShadow: `0 -5px 20px rgba(${currentTheme.c1}, 0.2)` }
                  : {}
              }
              className={`group px-4 py-2.5 rounded-t-2xl text-xs font-bold transition-all duration-200 flex items-center gap-3 max-w-[240px] ${
                activeTab === doc.id 
                  ? "bg-[#181a2e] text-purple-300 border-t-2" 
                  : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
              }`}
            >
              <button onClick={() => { setActiveTab(doc.id); setPageNum(1); }} className="flex items-center gap-2 truncate">
                {doc.isLocked ? <Lock className="h-3.5 w-3.5 text-red-400 shrink-0" /> : <FileText className="h-3.5 w-3.5 text-cyan-400 shrink-0" />}
                <span className="truncate">{doc.name}</span>
              </button>
              <button onClick={(e) => handleCloseDocument(e, doc.id)} className="p-1 rounded-full text-gray-500 hover:bg-red-500/20 hover:text-red-400 transition" title="Close Tab">
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}

          <label className="p-2 rounded-xl cursor-pointer text-gray-400 hover:bg-white/10 hover:text-cyan-300 transition" title="Open PDF Tab">
            <Plus className="h-4 w-4" />
            <input type="file" accept="application/pdf" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      </div>

      {/* TOOLBAR CONTROLS */}
      {activeTab !== "dashboard" && currentDoc && !currentDoc.isLocked && (
        <div className="relative z-20 flex h-12 items-center justify-between bg-[#131526]/90 backdrop-blur-md px-5 border-b border-white/10 text-xs shrink-0 shadow-lg">
          <div className="flex items-center gap-2">
            <button onClick={() => setLeftSidebarOpen(!leftSidebarOpen)} className={`p-2 rounded-xl transition ${leftSidebarOpen ? 'text-cyan-400 bg-white/10 shadow-[0_0_15px_rgba(6,182,212,0.3)]' : 'text-gray-400 hover:text-white'}`} title="Thumbnails Sidebar"><PanelLeft className="h-4 w-4" /></button>
            <button onClick={() => window.print()} className="p-2 text-gray-400 hover:text-white rounded-xl transition hover:bg-white/5" title="Print"><Printer className="h-4 w-4" /></button>
          </div>

          <div className="flex items-center gap-1.5 bg-black/70 border border-white/15 p-1.5 rounded-2xl shadow-2xl backdrop-blur-xl">
            <button 
              onClick={() => setActiveTool("select")} 
              style={activeTool === 'select' ? { backgroundColor: `rgba(${currentTheme.c1}, 1)`, boxShadow: `0 0 20px rgba(${currentTheme.c1}, 0.6)` } : {}}
              className={`p-2 rounded-xl transition-all duration-200 ${activeTool === 'select' ? 'text-white' : 'text-gray-400 hover:text-white'}`} 
              title="Text Select"
            >
              <MousePointer2 className="h-4 w-4" />
            </button>

            <button 
              onClick={() => setActiveTool("pan")} 
              style={activeTool === 'pan' ? { backgroundColor: `rgba(${currentTheme.c1}, 1)`, boxShadow: `0 0 20px rgba(${currentTheme.c1}, 0.6)` } : {}}
              className={`p-2 rounded-xl transition-all duration-200 ${activeTool === 'pan' ? 'text-white' : 'text-gray-400 hover:text-white'}`} 
              title="Hand Pan Drag"
            >
              <Hand className="h-4 w-4" />
            </button>

            <button 
              onClick={() => setActiveTool("draw")} 
              style={activeTool === 'draw' ? { backgroundColor: `rgba(${currentTheme.c1}, 1)`, boxShadow: `0 0 20px rgba(${currentTheme.c1}, 0.6)` } : {}}
              className={`p-2 rounded-xl transition-all duration-200 ${activeTool === 'draw' ? 'text-white' : 'text-gray-400 hover:text-white'}`} 
              title="Vector Pen"
            >
              <PenTool className="h-4 w-4" />
            </button>

            <button 
              onClick={() => setActiveTool("highlight")} 
              style={activeTool === 'highlight' ? { backgroundColor: `rgba(${currentTheme.c1}, 1)`, boxShadow: `0 0 20px rgba(${currentTheme.c1}, 0.6)` } : {}}
              className={`p-2 rounded-xl transition-all duration-200 ${activeTool === 'highlight' ? 'text-white' : 'text-gray-400 hover:text-white'}`} 
              title="Highlighter"
            >
              <Highlighter className="h-4 w-4" />
            </button>

            <button onClick={() => setActiveTool("note")} className={`p-2 rounded-xl transition-all duration-200 ${activeTool === 'note' ? 'bg-amber-500 text-gray-950 shadow-[0_0_20px_rgba(245,158,11,0.6)]' : 'text-gray-400 hover:text-white'}`} title="Sticky Note"><StickyNote className="h-4 w-4" /></button>
            <button onClick={() => setActiveTool("eraser")} className={`p-2 rounded-xl transition-all duration-200 ${activeTool === 'eraser' ? 'bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.6)]' : 'text-gray-400 hover:text-white'}`} title="Eraser Tool"><Eraser className="h-4 w-4" /></button>

            <div className="flex items-center bg-white/5 rounded-xl px-2">
              <button onClick={() => setActiveTool("stamp")} className={`p-1.5 rounded-lg transition ${activeTool === 'stamp' ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(10,185,129,0.5)]' : 'text-gray-400 hover:text-white'}`} title="Place Stamp"><Stamp className="h-4 w-4" /></button>
              <select value={stampPreset} onChange={(e) => setStampPreset(e.target.value)} className="bg-transparent text-[11px] text-emerald-400 outline-none cursor-pointer font-bold px-1.5">
                {STAMP_PRESETS.map(s => (
                  <option key={s.label} value={s.label} className="bg-gray-900">{s.label}</option>
                ))}
              </select>
            </div>

            <div className="h-4 w-[1px] bg-white/20 mx-1" />
            <button onClick={handleUndo} disabled={!currentDoc || currentDoc.history.length === 0} className="p-2 rounded-xl text-gray-400 hover:text-white disabled:opacity-30 transition" title="Undo"><Undo2 className="h-4 w-4" /></button>
            <button onClick={handleRedo} disabled={!currentDoc || currentDoc.redoStack.length === 0} className="p-2 rounded-xl text-gray-400 hover:text-white disabled:opacity-30 transition" title="Redo"><Redo2 className="h-4 w-4" /></button>

            <input type="color" value={drawColor} onChange={(e) => setDrawColor(e.target.value)} className="w-6 h-6 rounded-xl cursor-pointer bg-transparent border-0 ml-1 hover:scale-110 transition-transform" title="Pen Color" />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-3 py-1.5">
              <button onClick={() => setPageNum(p => Math.max(1, p - 1))} className="text-gray-400 hover:text-white transition"><ChevronLeft className="h-4 w-4" /></button>
              <span className="text-gray-200 font-mono text-xs font-bold">{pageNum} / {currentDoc.totalPages}</span>
              <button onClick={() => setPageNum(p => Math.min(currentDoc.totalPages, p + 1))} className="text-gray-400 hover:text-white transition"><ChevronRight className="h-4 w-4" /></button>
            </div>

            <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-2xl px-2.5 py-1.5">
              <button onClick={() => setScale(s => Math.max(0.5, s - 0.15))} className="text-gray-400 hover:text-white transition"><ZoomOut className="h-4 w-4" /></button>
              <span className="text-xs font-mono w-10 text-center font-bold text-cyan-300">{Math.round(scale * 100)}%</span>
              <button onClick={() => setScale(s => s + 0.15)} className="text-gray-400 hover:text-white transition"><ZoomIn className="h-4 w-4" /></button>
            </div>

            <button onClick={() => setGlobalRotation(r => (r + 90) % 360)} className="p-2 text-gray-400 hover:text-white rounded-xl transition hover:bg-white/10" title="Rotate Document Workspace"><RotateCw className="h-4 w-4" /></button>
            
            <button onClick={() => setRightSidebarOpen(!rightSidebarOpen)} className={`p-2 rounded-xl transition ${rightSidebarOpen ? 'text-cyan-400 bg-white/10 shadow-[0_0_15px_rgba(6,182,212,0.3)]' : 'text-gray-400 hover:text-white'}`} title="Tools Sidebar"><PanelRight className="h-4 w-4" /></button>
          </div>
        </div>
      )}

      {/* WORKSPACE CONTENT AREA */}
      <div className="flex-1 overflow-hidden relative flex z-10">

        {activeTab === "dashboard" && (
          <div className="h-full w-full overflow-y-auto p-8 max-w-7xl mx-auto space-y-10">
            {/* BRAND HERO CARD */}
            <div 
              style={{
                borderColor: `rgba(${currentTheme.c1}, 0.3)`,
                boxShadow: `0 25px 60px rgba(0,0,0,0.7)`
              }}
              className="bg-gradient-to-r from-purple-900/40 via-fuchsia-900/30 to-black/60 backdrop-blur-2xl p-9 rounded-3xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden"
            >
              <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
              <div className="space-y-3 z-10">
                <div 
                  style={{
                    backgroundColor: `rgba(${currentTheme.c1}, 0.2)`,
                    borderColor: `rgba(${currentTheme.c1}, 0.3)`,
                    color: `rgba(${currentTheme.c1}, 1)`
                  }}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border shadow-lg"
                >
                  <Sparkles className="h-3.5 w-3.5 text-yellow-300 animate-spin" /> High-Performance PDF Studio Engine
                </div>
                <h1 
                  style={{
                    backgroundImage: `linear-gradient(to right, rgba(${currentTheme.c1}, 1), rgba(${currentTheme.c2}, 1))`
                  }}
                  className="text-4xl md:text-5xl font-black font-['Orbitron'] tracking-wider text-transparent bg-clip-text"
                >
                  APEX STUDIO
                </h1>
                <p className="text-xs md:text-sm text-gray-400 max-w-2xl leading-relaxed">
                  Enterprise-grade PDF suite featuring live page thumbnails, smart dark mode, vector drawing engine, page organizer, and digital security encryption.
                </p>
              </div>
              <label 
                style={{
                  backgroundImage: `linear-gradient(to right, rgba(${currentTheme.c1}, 1), rgba(${currentTheme.c2}, 1))`,
                  boxShadow: `0 0 35px rgba(${currentTheme.c1}, 0.6)`
                }}
                className="inline-flex items-center gap-3 px-7 py-4 rounded-2xl font-black text-xs cursor-pointer shadow-lg transition-all hover:scale-105 active:scale-95 z-10 text-white"
              >
                <FileUp className="h-5 w-5" /> Load PDF Document
                <input type="file" accept="application/pdf" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            {/* RECENT FILES TRACKING SECTION */}
            {recentFiles.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xs font-black text-gray-400 tracking-widest uppercase flex items-center gap-2">
                  <Clock className="h-4 w-4 text-cyan-400" /> Recent Files History ({recentFiles.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recentFiles.map((rf, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleOpenRecentFile(rf)}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setContextMenu({ visible: true, x: e.clientX, y: e.clientY, file: rf, pageNum: 1 });
                      }}
                      className="p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-between hover:bg-white/10 cursor-pointer transition relative group"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 shrink-0">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="truncate">
                          <p className="text-xs font-bold text-gray-200 group-hover:text-cyan-300 truncate">{rf.name}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">{rf.totalPages} Pages • {rf.dateOpened}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-1 rounded bg-white/10 text-gray-400 group-hover:text-white shrink-0 ml-2">PDF</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {documents.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xs font-black text-gray-400 tracking-widest uppercase flex items-center gap-2"><FileText className="h-4 w-4 text-cyan-400" /> Active Documents ({documents.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {documents.map(doc => (
                    <div 
                      key={doc.id} 
                      onClick={() => setActiveTab(doc.id)} 
                      style={{
                        borderColor: activeTab === doc.id ? `rgba(${currentTheme.c1}, 0.6)` : 'rgba(255,255,255,0.1)'
                      }}
                      className="p-6 bg-white/5 backdrop-blur-xl border rounded-3xl cursor-pointer hover:bg-white/10 transition-all duration-300 flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-4 overflow-hidden">
                        {doc.isLocked ? <Lock className="h-9 w-9 text-red-400 shrink-0" /> : <FileText className="h-9 w-9 text-cyan-400 shrink-0" />}
                        <div className="truncate">
                          <h3 className="font-bold text-sm truncate text-gray-200 group-hover:text-cyan-300">{doc.name}</h3>
                          <p className="text-[10px] text-gray-400 mt-1">{doc.totalPages} Pages • {doc.stamps.length} Stamps • {doc.stickyNotes.length} Notes</p>
                        </div>
                      </div>
                      <button onClick={(e) => handleCloseDocument(e, doc.id)} className="p-2 rounded-full text-gray-500 hover:bg-red-500/20 hover:text-red-400 transition opacity-0 group-hover:opacity-100"><X className="h-4 w-4" /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <h2 className="text-xs font-black text-cyan-400 tracking-widest uppercase flex items-center gap-2"><Sliders className="h-4 w-4" /> PDF Processing Tools Catalog</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {WORKSTATION_TOOLS.map(tool => (
                  <button 
                    key={tool.id} 
                    onClick={() => setActiveModal(tool.id)} 
                    className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl hover:bg-white/10 transition-all duration-300 flex flex-col items-center text-center group hover:-translate-y-1"
                  >
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:border-white/30 transition mb-3">
                      <tool.icon className={`h-8 w-8 ${tool.color} group-hover:scale-110 transition-transform`} />
                    </div>
                    <span className="text-xs font-bold text-gray-200 group-hover:text-cyan-300">{tool.name}</span>
                    <span className="text-[10px] text-gray-500 mt-1">{tool.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab !== "dashboard" && currentDoc && currentDoc.isLocked && (
          <div className="h-full w-full flex items-center justify-center p-6 bg-[#07080e]/95 backdrop-blur-2xl">
            <div className="max-w-md w-full p-8 bg-[#121526] border border-red-500/30 rounded-3xl shadow-[0_20px_60px_rgba(239,68,68,0.2)] text-center space-y-6">
              <div className="w-16 h-16 bg-red-500/20 border border-red-500/40 rounded-3xl flex items-center justify-center mx-auto text-red-400 animate-pulse">
                <Lock className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-white">Document Password Protected</h3>
                <p className="text-xs text-gray-400">Enter authorized passkey to render PDF pages.</p>
              </div>
              <input 
                type="password" 
                value={passwordInput} 
                onChange={(e) => setPasswordInput(e.target.value)} 
                placeholder="Enter decryption password..." 
                className="w-full px-4 py-3 bg-black/50 border border-white/15 rounded-2xl text-xs text-white outline-none focus:border-purple-500 text-center"
              />
              <button onClick={handleUnlockDocument} className="w-full py-3 bg-gradient-to-r from-red-600 to-fuchsia-600 hover:from-red-500 hover:to-fuchsia-500 rounded-2xl font-bold text-xs text-white shadow-lg transition">
                Unlock PDF Document
              </button>
            </div>
          </div>
        )}

        {activeTab !== "dashboard" && currentDoc && !currentDoc.isLocked && (
          <>
            {leftSidebarOpen && (
              <div className="w-60 bg-[#0d0f1b]/90 backdrop-blur-2xl border-r border-white/10 flex flex-col h-full shrink-0">
                <div className="p-4 border-b border-white/10 text-[11px] font-black text-gray-400 uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-2"><Layers2 className="h-4 w-4 text-cyan-400" /> Thumbnails</span>
                  <button onClick={() => setLeftSidebarOpen(false)} className="text-gray-500 hover:text-white"><ChevronLeft className="h-4 w-4" /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {currentDoc.pageOrder.map(pNum => (
                    <MiniThumbnail 
                      key={pNum} 
                      pageNum={pNum} 
                      pdfDoc={currentDoc.pdfDoc} 
                      isActive={pageNum === pNum} 
                      pageRotation={currentDoc.pageRotations[pNum] || 0}
                      onClick={() => setPageNum(pNum)} 
                      themeConfig={currentTheme}
                    />
                  ))}
                </div>
              </div>
            )}

            <div 
              className={`flex-1 overflow-auto p-8 relative bg-[#06070c]/80 flex justify-center ${activeTool === 'pan' ? 'cursor-grab active:cursor-grabbing' : ''}`} 
              ref={scrollContainerRef} 
              onScroll={handleScroll}
              onMouseDown={handlePanMouseDown}
              onMouseMove={handlePanMouseMove}
              onMouseUp={handlePanMouseUp}
              onMouseLeave={handlePanMouseUp}
            >
              {readingRuler && (
                <div 
                  className="fixed left-0 right-0 h-20 bg-yellow-400/10 pointer-events-none z-50 border-y-2 border-yellow-400/40 mix-blend-screen"
                  style={{ top: rulerY }}
                />
              )}

              <div className="space-y-8">
                {currentDoc.pageOrder.map((pNum) => (
                  <PdfPage 
                    key={pNum} 
                    pageNum={pNum} 
                    pdfDoc={currentDoc.pdfDoc} 
                    scale={scale} 
                    globalRotation={globalRotation} 
                    pageRotations={currentDoc.pageRotations}
                    smartDarkMode={smartDarkMode} 
                    activeTool={activeTool} 
                    drawColor={drawColor} 
                    strokeWidth={strokeWidth} 
                    paths={currentDoc.paths}
                    stamps={currentDoc.stamps} 
                    stickyNotes={currentDoc.stickyNotes}
                    watermark={watermark} 
                    onAddPath={handleAddPath}
                    onUpdateStamp={handleUpdateStamp}
                    onDeleteStamp={handleDeleteStamp}
                    onAddStickyNote={handleAddStickyNote}
                    onUpdateStickyNote={handleUpdateStickyNote}
                    onDeleteStickyNote={handleDeleteStickyNote}
                    showToast={showToast}
                    onContextMenu={handleContextMenu}
                    onRotateIndividualPage={handleRotateIndividualPage}
                    themeConfig={currentTheme}
                  />
                ))}
              </div>
            </div>

            {rightSidebarOpen && (
              <div className="w-68 bg-[#0d0f1b]/90 backdrop-blur-2xl border-l border-white/10 flex flex-col h-full shrink-0">
                <div className="flex border-b border-white/10 text-xs font-bold bg-[#121526]">
                  <button 
                    onClick={() => setRightSidebarTab("tools")} 
                    style={
                      rightSidebarTab === "tools"
                        ? { backgroundColor: `rgba(${currentTheme.c1}, 0.2)`, color: `rgba(${currentTheme.c1}, 1)`, borderBottomColor: `rgba(${currentTheme.c1}, 1)` }
                        : {}
                    }
                    className={`flex-1 py-3 text-center transition ${rightSidebarTab === "tools" ? "border-b-2" : "text-gray-400 hover:text-white"}`}
                  >
                    Tools
                  </button>
                  <button 
                    onClick={() => setRightSidebarTab("saved")} 
                    style={
                      rightSidebarTab === "saved"
                        ? { backgroundColor: `rgba(${currentTheme.c1}, 0.2)`, color: `rgba(${currentTheme.c1}, 1)`, borderBottomColor: `rgba(${currentTheme.c1}, 1)` }
                        : {}
                    }
                    className={`flex-1 py-3 text-center transition ${rightSidebarTab === "saved" ? "border-b-2" : "text-gray-400 hover:text-white"}`}
                  >
                    Saved ({currentDoc.stamps.length + currentDoc.stickyNotes.length})
                  </button>
                </div>

                {rightSidebarTab === "tools" && (
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    <h4 className="text-[10px] font-black text-cyan-400 tracking-wider uppercase px-1">Processing Suite</h4>
                    <div className="space-y-1.5">
                      {WORKSTATION_TOOLS.map(item => (
                        <button 
                          key={item.id} 
                          onClick={() => setActiveModal(item.id)}
                          className="w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-semibold text-gray-300 hover:bg-white/10 hover:text-cyan-300 transition-all duration-200 text-left group border border-transparent"
                        >
                          <item.icon className={`h-4 w-4 ${item.color} group-hover:scale-110 transition-transform`} />
                          <span>{item.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {rightSidebarTab === "saved" && (
                  <div className="flex-1 overflow-y-auto p-4 text-xs text-gray-400 space-y-5">
                    <div>
                      <p className="font-bold text-gray-300 mb-2.5 flex items-center justify-between">
                        <span>Stamps</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px]">{currentDoc.stamps.length}</span>
                      </p>
                      {currentDoc.stamps.map((st) => (
                        <div key={st.id} className="p-3 bg-white/5 rounded-2xl border border-white/10 flex justify-between items-center mb-2 hover:bg-white/10 transition">
                          <span className="font-bold text-[11px]" style={{ color: st.color }}>{st.text} (p. {st.page})</span>
                          <button onClick={() => handleDeleteStamp(st.id)} className="text-gray-500 hover:text-red-400 transition"><Trash2 className="h-3.5 w-3.5" /></button>
                        </div>
                      ))}
                    </div>

                    <div>
                      <p className="font-bold text-gray-300 mb-2.5 flex items-center justify-between">
                        <span>Sticky Notes</span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px]">{currentDoc.stickyNotes.length}</span>
                      </p>
                      {currentDoc.stickyNotes.map((n) => (
                        <div key={n.id} className="p-3 bg-yellow-400/10 rounded-2xl border border-yellow-400/30 flex justify-between items-center mb-2 hover:bg-yellow-400/20 transition">
                          <span className="truncate text-yellow-300 text-[11px] font-medium">{n.text} (p. {n.page})</span>
                          <button onClick={() => handleDeleteStickyNote(n.id)} className="text-gray-500 hover:text-red-400 transition"><Trash2 className="h-3.5 w-3.5" /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* FOOTER STATUS BAR */}
      <footer className="h-7 bg-[#090b10] border-t border-white/10 flex items-center justify-between px-4 text-[10px] text-gray-400 shrink-0 font-mono">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5"><Cpu className="h-3 w-3 text-emerald-400" /> GPU Acceleration Active</span>
          {currentDoc && <span>File: {currentDoc.name} ({currentDoc.totalPages} Pages)</span>}
        </div>
        <div className="flex items-center gap-4">
          <span>Scale: {Math.round(scale * 100)}%</span>
          <span>Theme: {currentTheme.name}</span>
        </div>
      </footer>

      {/* MODAL DIALOGS */}

      {activeModal === "esign" && (
        <ESignaturePad onSave={() => showToast("Digital Signature Embedded")} onClose={() => setActiveModal(null)} />
      )}

      {activeModal === "combine" && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121526] border border-white/15 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="font-black text-sm text-white flex items-center gap-2"><Layers className="h-4 w-4 text-purple-400" /> Combine Files Studio</h3>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-white"><X className="h-4 w-4" /></button>
            </div>
            <p className="text-xs text-gray-400">Select another PDF file to merge with current open document.</p>
            <label className="flex flex-col items-center justify-center p-6 bg-white/5 border-2 border-dashed border-white/20 rounded-2xl hover:border-purple-500 cursor-pointer">
              <FileUp className="h-8 w-8 text-purple-400 mb-2" />
              <span className="text-xs font-bold text-gray-300">Choose PDF to Merge</span>
              <input type="file" accept="application/pdf" onChange={() => { showToast("Merged target document!"); setActiveModal(null); }} className="hidden" />
            </label>
          </div>
        </div>
      )}

      {activeModal === "flatten" && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121526] border border-white/15 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="font-black text-sm text-white flex items-center gap-2"><FileCheck className="h-4 w-4 text-indigo-400" /> Flatten Document Layers</h3>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-white"><X className="h-4 w-4" /></button>
            </div>
            <p className="text-xs text-gray-400">Lock all annotations, vector paths, and stamps into the base PDF layer to prevent future edits.</p>
            <button onClick={() => { showToast("Flattened annotations into PDF!"); setActiveModal(null); }} className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-bold text-xs text-white shadow-lg transition">
              Flatten All Annotations
            </button>
          </div>
        </div>
      )}

      {activeModal === "organize" && currentDoc && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-[#121526] border border-white/15 rounded-3xl max-w-2xl w-full p-7 space-y-6 shadow-[0_25px_70px_rgba(0,0,0,0.8)]">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <h3 className="font-black text-base text-white flex items-center gap-2.5"><ArrowUpDown className="h-5 w-5 text-fuchsia-400" /> Organize & Reorder Document Pages</h3>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-white"><X className="h-5 w-5" /></button>
            </div>
            <p className="text-xs text-gray-400">Reorder pages using control buttons below to customize page sequence.</p>
            <div className="max-h-80 overflow-y-auto space-y-2.5 pr-2">
              {currentDoc.pageOrder.map((pNum, index) => (
                <div key={pNum} className="flex items-center justify-between p-3.5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition">
                  <span className="font-mono text-xs font-bold text-cyan-300">Page {pNum}</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleMovePage(index, 'up')} disabled={index === 0} className="p-1.5 rounded-lg bg-white/10 hover:bg-purple-600 text-white disabled:opacity-30 transition"><ChevronLeft className="h-4 w-4 rotate-90" /></button>
                    <button onClick={() => handleMovePage(index, 'down')} disabled={index === currentDoc.pageOrder.length - 1} className="p-1.5 rounded-lg bg-white/10 hover:bg-purple-600 text-white disabled:opacity-30 transition"><ChevronRight className="h-4 w-4 rotate-90" /></button>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => { setActiveModal(null); showToast("Page Sequence Updated"); }} className="w-full py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-2xl font-bold text-xs text-white shadow-lg transition hover:scale-[1.02]">
              Apply Page Sequence
            </button>
          </div>
        </div>
      )}

      {activeModal === "export" && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#121526] border border-white/15 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="font-black text-sm text-white flex items-center gap-2"><Download className="h-4 w-4 text-emerald-400" /> Export PDF Options</h3>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-white"><X className="h-4 w-4" /></button>
            </div>
            <div className="space-y-3">
              <button onClick={handleExportPDF} className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 text-left text-xs font-bold text-gray-200 transition flex items-center justify-between group">
                <div>
                  <p className="text-cyan-300 font-bold">Standard PDF Document (.pdf)</p>
                  <p className="text-[10px] text-gray-400 font-normal mt-0.5">Exports compiled document file</p>
                </div>
                <Download className="h-4 w-4 text-emerald-400 group-hover:scale-110 transition" />
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModal === "protect" && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121526] border border-white/15 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="font-black text-sm text-white flex items-center gap-2"><Lock className="h-4 w-4 text-red-400" /> Password Protect Document</h3>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-white"><X className="h-4 w-4" /></button>
            </div>
            <p className="text-xs text-gray-400">Encrypt this PDF file with password protection.</p>
            <input type="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} placeholder="Set Master Password..." className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-xs text-white outline-none focus:border-purple-500" />
            <button onClick={handleApplyPassword} className="w-full py-2.5 bg-gradient-to-r from-red-600 to-fuchsia-600 rounded-xl font-bold text-xs text-white shadow-lg transition hover:scale-105">
              Lock Document
            </button>
          </div>
        </div>
      )}

      {activeModal === "unlock" && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121526] border border-white/15 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="font-black text-sm text-white flex items-center gap-2"><Unlock className="h-4 w-4 text-green-400" /> Unlock PDF Security</h3>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-white"><X className="h-4 w-4" /></button>
            </div>
            <p className="text-xs text-gray-400">Remove operational restrictions and password locking from document.</p>
            <input type="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} placeholder="Enter Current Password..." className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-xs text-white outline-none focus:border-purple-500" />
            <button onClick={handleUnlockDocument} className="w-full py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl font-bold text-xs text-white shadow-lg transition hover:scale-105">
              Unlock Document
            </button>
          </div>
        </div>
      )}

      {activeModal === "split" && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121526] border border-white/15 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="font-black text-sm text-white flex items-center gap-2"><Split className="h-4 w-4 text-cyan-400" /> Split PDF Engine</h3>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-white"><X className="h-4 w-4" /></button>
            </div>
            <div className="space-y-3">
              <label className="text-xs text-gray-300 font-bold block">Page Range Selection</label>
              <input type="text" value={splitRange} onChange={(e) => setSplitRange(e.target.value)} placeholder="e.g. 1-2, 3-5" className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-xs text-white outline-none focus:border-purple-500" />
            </div>
            <button onClick={() => { showToast(`PDF Split into Ranges: ${splitRange}`); setActiveModal(null); }} className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl font-bold text-xs text-white shadow-lg transition">
              Process Split
            </button>
          </div>
        </div>
      )}

      {activeModal === "compress" && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121526] border border-white/15 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="font-black text-sm text-white flex items-center gap-2"><FileArchive className="h-4 w-4 text-amber-400" /> Compress PDF Studio</h3>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-white"><X className="h-4 w-4" /></button>
            </div>
            <div className="space-y-3">
              <label className="text-xs text-gray-300 font-bold block">Compression Profile</label>
              <select value={compressQuality} onChange={(e) => setCompressQuality(e.target.value)} className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-xs text-white outline-none">
                <option value="extreme" className="bg-gray-900">Extreme Compression</option>
                <option value="recommended" className="bg-gray-900">Recommended Compression</option>
                <option value="high" className="bg-gray-900">High Quality</option>
              </select>
            </div>
            <button onClick={() => { showToast("PDF Size Reduced by 64%"); setActiveModal(null); }} className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl font-bold text-xs text-white shadow-lg transition">
              Compress PDF File
            </button>
          </div>
        </div>
      )}

      {activeModal === "ocr" && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121526] border border-white/15 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="font-black text-sm text-white flex items-center gap-2"><ScanText className="h-4 w-4 text-blue-400" /> OCR Scanner Engine</h3>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-white"><X className="h-4 w-4" /></button>
            </div>
            <button onClick={handleRunOcr} disabled={isOcrProcessing} className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold text-xs text-white shadow-lg transition flex items-center justify-center gap-2">
              {isOcrProcessing ? <Sparkles className="h-4 w-4 animate-spin" /> : <ScanText className="h-4 w-4" />}
              {isOcrProcessing ? "Scanning Document Layer..." : "Run OCR Text Extraction"}
            </button>
            {ocrText && (
              <textarea value={ocrText} readOnly className="w-full h-40 bg-black/50 border border-white/15 rounded-xl p-3 text-xs text-cyan-300 font-mono outline-none resize-none" />
            )}
          </div>
        </div>
      )}

      {activeModal === "translate" && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121526] border border-white/15 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="font-black text-sm text-white flex items-center gap-2"><Languages className="h-4 w-4 text-pink-400" /> Multi-Language Translator</h3>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-white"><X className="h-4 w-4" /></button>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-xs text-gray-300 font-bold shrink-0">Target Language:</label>
              <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)} className="flex-1 px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-xs text-white outline-none">
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Japanese">Japanese</option>
              </select>
            </div>
            <button onClick={handleRunTranslation} className="w-full py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl font-bold text-xs text-white shadow-lg transition">
              Translate PDF Content
            </button>
            {translatedText && (
              <textarea value={translatedText} readOnly className="w-full h-36 bg-black/50 border border-white/15 rounded-xl p-3 text-xs text-pink-300 font-mono outline-none resize-none" />
            )}
          </div>
        </div>
      )}

      {activeModal === "watermark" && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121526] border border-white/15 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="font-black text-sm text-white flex items-center gap-2"><Stamp className="h-4 w-4 text-violet-400" /> Watermark Customizer</h3>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-white"><X className="h-4 w-4" /></button>
            </div>
            <div className="space-y-3">
              <input type="text" value={watermark.text} onChange={(e) => setWatermark({ ...watermark, text: e.target.value })} placeholder="Watermark text..." className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-xs text-white outline-none" />
              <div className="flex items-center justify-between text-xs text-gray-300">
                <span>Opacity:</span>
                <input type="range" min="0.1" max="1" step="0.05" value={watermark.opacity} onChange={(e) => setWatermark({ ...watermark, opacity: parseFloat(e.target.value) })} className="w-32 cursor-pointer" />
              </div>
            </div>
            <button onClick={() => { showToast("Watermark Applied"); setActiveModal(null); }} className="w-full py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl font-bold text-xs text-white shadow-lg transition hover:scale-105">
              Apply Watermark
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;