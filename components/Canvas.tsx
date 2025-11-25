import React from "react";
import { ZoomIn, ZoomOut, Maximize2, Move } from "lucide-react";
import { useCanvas } from "../hooks/useCanvas";
import { HistoryItem } from "../types";

interface CanvasProps {
  activeItem?: HistoryItem;
  children?: React.ReactNode;
}

export const Canvas: React.FC<CanvasProps> = ({ activeItem, children }) => {
  const { state, containerRef, handlers, resetView, zoomIn, zoomOut } = useCanvas();

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Canvas Controls */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-1 bg-slate-900/90 backdrop-blur-sm rounded-lg p-1 border border-slate-800">
        <button
          onClick={zoomOut}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
          title="Zoom out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <span className="text-xs text-slate-400 px-2 min-w-[3rem] text-center">
          {Math.round(state.scale * 100)}%
        </span>
        <button
          onClick={zoomIn}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
          title="Zoom in"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-slate-700 mx-1" />
        <button
          onClick={resetView}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
          title="Reset view"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Drag hint */}
      <div className="absolute bottom-3 left-3 z-20 flex items-center gap-1.5 text-[10px] text-slate-500">
        <Move className="w-3 h-3" />
        <span>Drag to pan • Scroll to zoom</span>
      </div>

      {/* Pannable/Zoomable Container */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing touch-none select-none bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px]"
        {...handlers}
      >
        <div
          className="w-full h-full flex items-center justify-center"
          style={{
            transform: `translate(${state.x}px, ${state.y}px) scale(${state.scale})`,
            transformOrigin: "center center",
          }}
        >
          {activeItem ? (
            <img
              src={activeItem.imageUrl}
              alt="Generated Logo"
              className="max-w-[80%] max-h-[80%] object-contain rounded-lg shadow-2xl shadow-black/50 pointer-events-none"
              draggable={false}
            />
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
};
