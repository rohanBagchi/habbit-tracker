import { createFileRoute } from '@tanstack/react-router';
import { Excalidraw } from '@excalidraw/excalidraw';
import '@excalidraw/excalidraw/index.css';
export const Route = createFileRoute('/draw')({
  component: Draw
});

function Draw() {
  return (
    <div className='w-full h-[calc(100dvh-53px)]'>
      <Excalidraw />
    </div>
  );
}
