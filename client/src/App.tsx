
import React, { useEffect, useRef, useCallback } from 'react';
import { Engine, Vector3 } from 'babylonjs';
import { createScene } from './game/engine/createScene';
import { SnowmanController } from './game/controllers/SnowmanController';
import HUD from './ui/HUD';
import PauseMenu from './ui/PauseMenu';
import { useGameStore } from './state/gameStore';
import Reticle from './ui/Reticle';
import { getWorldConfig } from './game/config/worldConfig';

export const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const setPaused = useGameStore((s) => s.setPaused);
  const setFocused = useGameStore((s) => s.setFocused);
  const isFocused = useGameStore((s) => s.isFocused);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.warn('Canvas ref is null');
      return;
    }
    const engine = new Engine(canvas, true);
    const scene = createScene(engine, canvas);
    const controls = getWorldConfig().controls;

    // Get snowman and create controller
    const snowman = (window as any).snowman;
    const snowmanController = new SnowmanController(snowman.getMesh());
    const camera = (window as any).camera;

    // Mouse look state
    const mouseState = {
      mouseX: 0,
      mouseY: 0,
      lastMouseX: 0,
      lastMouseY: 0,
      rotationX: 0,
      rotationY: 0,
      mouseSensitivity: controls.mouseSensitivity
    };

    // Movement state
    const keysPressed = {
      forward: false,
      backward: false,
      left: false,
      right: false
    };

    // Mouse look handler
    function onMouseMove(e: MouseEvent) {
      if (!isFocused) return;
      
      // Check if pointer is locked (modern pointer lock API)
      if (document.pointerLockElement === canvas) {
        // Use movement deltas when pointer is locked
        mouseState.rotationY += e.movementX * mouseState.mouseSensitivity;
        mouseState.rotationX += e.movementY * mouseState.mouseSensitivity;
      } else {
        // Fallback to traditional mouse tracking
        mouseState.mouseX = e.clientX;
        mouseState.mouseY = e.clientY;
        
        // Accumulate rotation changes
        const deltaX = mouseState.mouseX - mouseState.lastMouseX;
        const deltaY = mouseState.mouseY - mouseState.lastMouseY;
        
        mouseState.rotationY += deltaX * mouseState.mouseSensitivity;
        mouseState.rotationX -= deltaY * mouseState.mouseSensitivity;
        
        mouseState.lastMouseX = mouseState.mouseX;
        mouseState.lastMouseY = mouseState.mouseY;
      }
      
      // Clamp vertical rotation
      mouseState.rotationX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, mouseState.rotationX));
    }

    engine.runRenderLoop(() => {
      // Handle continuous movement
      const moveSpeed = controls.playerMoveSpeed;
      let moveDirection = Vector3.Zero();

      const forward = camera.getDirection(Vector3.Forward());
      const right = camera.getDirection(Vector3.Right());

      if (keysPressed.forward) {
        moveDirection.addInPlace(forward);
      }
      if (keysPressed.backward) {
        moveDirection.addInPlace(forward.scale(-1));
      }
      if (keysPressed.left) {
        moveDirection.addInPlace(right.scale(-1));
      }
      if (keysPressed.right) {
        moveDirection.addInPlace(right);
      }

      // Restrict Y movement to keep snowman grounded
      moveDirection.y = 0;

      if (moveDirection.length() > 0) {
        snowmanController.move(moveDirection.normalize().scale(moveSpeed));
      }

      // Handle mouse look
      if (isFocused) {
        camera.rotation.y = mouseState.rotationY;
        camera.rotation.x = mouseState.rotationX;
      }

      scene.render();
    });

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setFocused(false);
        setPaused(true);
        if (canvas) {
          canvas.blur();
          // Release pointer lock
          document.exitPointerLock();
        }
        return;
      }
      
      // Set movement flags
      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          keysPressed.forward = true;
          break;
        case 's':
        case 'arrowdown':
          keysPressed.backward = true;
          break;
        case 'a':
        case 'arrowleft':
          keysPressed.left = true;
          break;
        case 'd':
        case 'arrowright':
          keysPressed.right = true;
          break;
      }
    }

    function onKeyUp(e: KeyboardEvent) {
      // Clear movement flags
      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          keysPressed.forward = false;
          break;
        case 's':
        case 'arrowdown':
          keysPressed.backward = false;
          break;
        case 'a':
        case 'arrowleft':
          keysPressed.left = false;
          break;
        case 'd':
        case 'arrowright':
          keysPressed.right = false;
          break;
      }
    }
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    // Focus/blur handlers for canvas
    function onCanvasFocus() {
      setFocused(true);
      // Initialize mouse position to center of screen
      mouseState.lastMouseX = window.innerWidth / 2;
      mouseState.lastMouseY = window.innerHeight / 2;
      mouseState.mouseX = mouseState.lastMouseX;
      mouseState.mouseY = mouseState.lastMouseY;
      // Reset rotation accumulators
      mouseState.rotationX = camera.rotation.x;
      mouseState.rotationY = camera.rotation.y;
    }

    function onCanvasBlur() {
      setFocused(false);
      // Release pointer lock when canvas loses focus
      document.exitPointerLock();
    }

    canvas.addEventListener('focus', onCanvasFocus);
    canvas.addEventListener('blur', onCanvasBlur);
    window.addEventListener('mousemove', onMouseMove);

    // Focus canvas on click
    function onCanvasClick() {
      if (canvas) {
        canvas.focus();
        // Request pointer lock for mouse capture
        canvas.requestPointerLock();
      }
    }

    canvas.addEventListener('click', onCanvasClick);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('focus', onCanvasFocus);
      canvas.removeEventListener('blur', onCanvasBlur);
      canvas.removeEventListener('click', onCanvasClick);
      engine.dispose();
    };
  }, [setPaused, setFocused, isFocused]);

  return (
	<div style={{ width: '100vw', height: '100vh', position: 'relative', background: '#222' }}>
		<canvas ref={canvasRef} id="renderCanvas" tabIndex={0} style={{ width: '100%', height: '100%', display: 'block' }} />
		<HUD />
		<PauseMenu />
    <Reticle />
	</div>
  );
};

export default App
