import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '../../../convex/_generated/api';
import { type Id } from '../../../convex/_generated/dataModel.d';
import { useMutation } from 'convex/react';
import { getFakeName } from './getFakeName';

export function AddReminder({ taskId, onClose }: { taskId: Id<'tasks'>; onClose: () => void }) {
  const createReminder = useMutation(api.reminders.createReminder);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const text = formData.get('text') as string;
    const dueDate = formData.get('dueDate') as string;
    if (text) {
      await createReminder({ text, dueDate, taskId });
      onClose();
    }
  };

  return (
    <Dialog
      open
      onOpenChange={onClose}
    >
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Add reminder</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className='grid gap-4'>
            <div className='grid gap-3'>
              <Label htmlFor='name-1'>Text</Label>
              <Input
                id='name-1'
                name='text'
                defaultValue={getFakeName()}
                required
              />
            </div>
            <div className='grid gap-3'>
              <Label htmlFor='dueDate'>Due date</Label>
              <Input
                id='dueDate'
                name='dueDate'
                type='datetime-local'
                required
              />
            </div>
          </div>
          <DialogFooter className='mt-4'>
            <DialogClose asChild>
              <Button
                variant='outline'
                onClick={onClose}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button type='submit'>Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
