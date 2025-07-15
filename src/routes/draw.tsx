import { createFileRoute } from '@tanstack/react-router';
import { Excalidraw } from '@excalidraw/excalidraw';
import '@excalidraw/excalidraw/index.css';
export const Route = createFileRoute('/draw')({
  component: Draw
});

function Draw() {
  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Excalidraw Example</h1>
      <div className='w-dvw h-dvh'>
        <Excalidraw />
      </div>
    </div>
  );
}
