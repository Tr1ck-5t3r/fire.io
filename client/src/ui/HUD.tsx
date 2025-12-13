import React from 'react'
import { useGameStore } from '../state/gameStore'

export const HUD: React.FC = () => {
  const health = useGameStore((s) => s.health)
  const ammo = useGameStore((s) => s.ammo)
  return (
    <div style={{ position: 'absolute', top: 10, left: 10, color: 'white', fontFamily: 'sans-serif' }}>
      <div>Health: {health}</div>
      <div>Ammo: {ammo}</div>
      {/* Centered HTML crosshair removed in favor of Babylon GUI crosshair in createScene.ts */}
    </div>
  )
}

export default HUD
