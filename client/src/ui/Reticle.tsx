import React from 'react'

type ReticleProps = {
  size?: number // overall size in px
  color?: string
  thickness?: number // px
}

const Reticle: React.FC<ReticleProps> = ({ size = 10, color = 'black', thickness = 2 }) => {
  const half = size / 2

  return (
    <div  
      aria-hidden
      style={{
        position: 'fixed',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      <div style={{ position: 'relative', width: size, height: size }}>
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            transform: 'translateX(-50%)',
            width: thickness,
            height: size,
            background: color,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            transform: 'translateY(-50%)',
            height: thickness,
            width: size,
            background: color,
          }}
        />
      </div>
    </div>
  )
}

export default Reticle
