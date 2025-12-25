import React, { useEffect, useRef } from "react";
import { Engine, Vector3 } from "babylonjs";
import { createScene } from "./game/engine/createScene";
import HUD from "./ui/HUD";
import PauseMenu from "./ui/PauseMenu";
import Reticle from "./ui/Reticle";
import { getWorldConfig } from "./game/config/worldConfig";
import { useGameStore } from "./state/gameStore";

export const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const setPaused = useGameStore((s) => s.setPaused);
  const setFocused = useGameStore((s) => s.setFocused);
  const isFocused = useGameStore((s) => s.isFocused);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const engine = new Engine(canvas, true);
    const scene = createScene(engine, canvas);
    const controls = getWorldConfig().controls;

    const snowman = (window as any).snowman;

    let yaw = 0;
    let pitch = 0;
    const maxPitch = Math.PI / 2 - 0.05;

    const keys = {
      w: false,
      a: false,
      s: false,
      d: false,
    };

    let verticalVelocity = 0;
    let grounded = false;

    const GROUND_Y = 0;
    const GROUND_EPSILON = 0.02;
    const MAX_FALL_SPEED = -0.3;

    /* -------------------- Mouse Look -------------------- */
    function onMouseMove(e: MouseEvent) {
      if (!isFocused || document.pointerLockElement !== canvas) return;

      yaw += e.movementX * controls.mouseSensitivity;
      pitch += e.movementY * controls.mouseSensitivity;
      pitch = Math.max(-maxPitch, Math.min(maxPitch, pitch));
    }

    /* -------------------- Game Loop -------------------- */
    engine.runRenderLoop(() => {
      const forward = new Vector3(Math.sin(yaw), 0, Math.cos(yaw));
      const right = new Vector3(
        Math.sin(yaw + Math.PI / 2),
        0,
        Math.cos(yaw + Math.PI / 2)
      );

      let move = Vector3.Zero();
      if (keys.w) move.addInPlace(forward);
      if (keys.s) move.subtractInPlace(forward);
      if (keys.a) move.subtractInPlace(right);
      if (keys.d) move.addInPlace(right);

      if (move.length() > 0) {
        snowman.move(move.normalize().scale(controls.playerMoveSpeed));
      }

      /* -------- Gravity -------- */
      verticalVelocity += controls.gravity;
      verticalVelocity = Math.max(verticalVelocity, MAX_FALL_SPEED);

      snowman.move(new Vector3(0, verticalVelocity, 0));

      const pos = snowman.getMesh().position;

      /* -------- Ground Detection -------- */
      if (pos.y <= GROUND_Y + GROUND_EPSILON && verticalVelocity <= 0) {
        pos.y = GROUND_Y;
        verticalVelocity = 0;
        grounded = true;
      } else {
        grounded = false;
      }

      snowman.rotateYaw(yaw);
      snowman.rotatePitch(pitch);

      scene.render();
    });

    /* -------------------- Input -------------------- */
    window.addEventListener("mousemove", onMouseMove);

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        setPaused(true);
        setFocused(false);
        document.exitPointerLock();
        return;
      }

      if (e.key === "w") keys.w = true;
      if (e.key === "a") keys.a = true;
      if (e.key === "s") keys.s = true;
      if (e.key === "d") keys.d = true;

      if (e.code === "Space" && grounded) {
        verticalVelocity = controls.jumpForce;
        grounded = false;
      }
    });

    window.addEventListener("keyup", (e) => {
      if (e.key === "w") keys.w = false;
      if (e.key === "a") keys.a = false;
      if (e.key === "s") keys.s = false;
      if (e.key === "d") keys.d = false;
    });

    canvas.addEventListener("click", () => {
      canvas.focus();
      canvas.requestPointerLock();
      setFocused(true);
    });

    return () => {
      engine.dispose();
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [isFocused, setFocused, setPaused]);

  return (
    <main style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      <canvas
        ref={canvasRef}
        tabIndex={0}
        style={{ width: "100%", height: "100%" }}
      />
      <HUD />
      <PauseMenu />
      <Reticle />
    </main>
  );
};

export default App;
