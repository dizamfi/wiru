import React, { useEffect, useRef } from 'react';
import { useRive, useStateMachineInput } from '@rive-app/react-canvas';

export interface RiveAnimationProps {
  src: string;
  className?: string;
  autoplay?: boolean;
  stateMachines?: string[];
  onLoad?: () => void;
  onLoadError?: (error: Error) => void;
  width?: number;
  height?: number;
}

export const RiveAnimation: React.FC<RiveAnimationProps> = ({
  src,
  className = '',
  autoplay = true,
  stateMachines,
  onLoad,
  onLoadError,
  width,
  height
}) => {
  const { rive, RiveComponent } = useRive({
    src,
    stateMachines,
    autoplay,
    onLoad,
    onLoadError: (error: any) => {
      console.error('Error loading Rive animation:', error);
      onLoadError?.(error);
    }
  });

  return (
    <div 
      className={`rive-container ${className}`}
      style={{ 
        width: width || '100%', 
        height: height || 'auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <RiveComponent 
        width={width}
        height={height}
        style={{
          maxWidth: '100%',
          height: 'auto'
        }}
      />
    </div>
  );
};

export default RiveAnimation;