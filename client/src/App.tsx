
import React, { useEffect, useRef } from 'react';
import { Engine } from 'babylonjs';
import { createScene } from './game/engine/createScene';
import { SnowmanController } from './game/controllers/SnowmanController';
import HUD from './ui/HUD';
import PauseMenu from './ui/PauseMenu';
import { useGameStore } from './state/gameStore';
import Reticle from './ui/Reticle';

export const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const setPaused = useGameStore((s) => s.setPaused);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.warn('Canvas ref is null');
      return;
    }
    const engine = new Engine(canvas, true);
    const scene = createScene(engine, canvas);

    // Example: create a snowman mesh and attach controller (placeholder)
    // const snowmanMesh = MeshBuilder.CreateBox('snowman', { size: 1 }, scene);
    // const snowmanController = new SnowmanController(snowmanMesh);

    engine.runRenderLoop(() => {
      scene.render();
    });

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setPaused(true);
    }
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      engine.dispose();
    };
  }, [setPaused]);

  return (
	<div style={{ width: '100vw', height: '100vh', position: 'relative', background: '#222' }}>
		<canvas ref={canvasRef} id="renderCanvas" style={{ width: '100%', height: '100%', display: 'block' }} />
		<HUD />
		<PauseMenu />
    <Reticle />
	</div>
  );
};

export default App
