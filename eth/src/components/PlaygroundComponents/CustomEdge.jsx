import React, { useState, useRef, useEffect } from 'react';
import { BaseEdge, EdgeLabelRenderer, getBezierPath } from 'reactflow';

const CustomEdge = ({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {}, markerEnd, data }) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const [showDelete, setShowDelete] = useState(false);
  const hideTimeoutRef = useRef(null);
  const [animationOffset, setAnimationOffset] = useState(0);

  // Animation effect for moving arrows
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationOffset(prev => (prev + 0.02) % 1); // Move arrows along the path
    }, 50); // Update every 50ms for smooth animation

    return () => clearInterval(interval);
  }, []);

  // Function to create arrow markers along the path
  const createArrowMarkers = () => {
    const arrowCount = 3; // Fixed number of arrows for better animation
    const arrows = [];

    for (let i = 0; i < arrowCount; i++) {
      // Calculate animated position along the path
      const basePosition = (i / arrowCount) + animationOffset;
      const t = basePosition % 1; // Keep position between 0 and 1
      
      // Calculate position along the bezier curve
      const x = sourceX + (targetX - sourceX) * t;
      const y = sourceY + (targetY - sourceY) * t;
      
      // Calculate rotation angle based on direction
      const angle = Math.atan2(targetY - sourceY, targetX - sourceX) * (180 / Math.PI);
      
      arrows.push(
        <g key={i} transform={`translate(${x}, ${y}) rotate(${angle})`}>
          <defs>
            <linearGradient id={`arrowGradient-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={style.stroke || '#3B82F6'} stopOpacity="0.8"/>
              <stop offset="100%" stopColor={style.stroke || '#1E40AF'} stopOpacity="1"/>
            </linearGradient>
          </defs>
          <path
            d="M0,0 L-12,-6 L-8,0 L-12,6 Z"
            fill={`url(#arrowGradient-${i})`}
            stroke={style.stroke || '#1E40AF'}
            strokeWidth="0.5"
            filter="drop-shadow(0 1px 2px rgba(0,0,0,0.1))"
          />
        </g>
      );
    }
    
    return arrows;
  };

  const show = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setShowDelete(true);
  };

  const hideWithDelay = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    hideTimeoutRef.current = setTimeout(() => {
      setShowDelete(false);
      hideTimeoutRef.current = null;
    }, 200);
  };

  return (
    <>
      {/* Visible edge */}
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          cursor: 'pointer',
        }}
      />

      {/* Directional arrows */}
      <g>
        {createArrowMarkers()}
      </g>

      {/* Invisible wide interaction path to reliably capture hover/clicks */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={24}
        style={{ pointerEvents: 'all' }}
        className="react-flow__edge-interaction"
        onMouseEnter={show}
        onMouseLeave={hideWithDelay}
        onClick={() => setShowDelete((v) => !v)}
      />

      <EdgeLabelRenderer>
        {showDelete && data?.onDelete && (
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
              zIndex: 1000,
            }}
            className="nodrag nopan"
            onMouseEnter={show}
            onMouseLeave={hideWithDelay}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                data.onDelete();
                setShowDelete(false);
              }}
              className="w-4 h-4 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors duration-200"
              title="Delete connection"
            >
              <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </EdgeLabelRenderer>
    </>
  );
};

export default CustomEdge;
