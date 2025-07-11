import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import clsx from 'clsx';
import { api } from '../../convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';
import { Clock, Edit, Trash } from 'lucide-react';
import React, { useState } from 'react';

import { createFileRoute } from '@tanstack/react-router';
import { AddReminder } from '@/components/reminders/add-reminder';
import type { Id } from 'convex/_generated/dataModel.d';
import { getParsedReminder } from '@/ai';

export const Route = createFileRoute('/todos')({
  component: Todo
});

function Todo() {
  const tasks = useQuery(api.tasks.get);
  const isAiParsingEnabled = useQuery(api.feature.getFeatureByName, {
    featureName: 'AI_PARSING'
  })?.isEnabled;
  const updateTask = useMutation(api.tasks.update);
  const createTask = useMutation(api.tasks.create);
  const deleteTask = useMutation(api.tasks.deleteTask);
  const createReminder = useMutation(api.reminders.createReminder);

  const [itemBeingEdited, setItemBeingEdited] = useState<null | string>(null);
  const [modalInfo, setModalInfo] = useState<null | {
    taskId: Id<'tasks'>;
  }>(null);

  console.log('isAiParsingEnabled:', isAiParsingEnabled);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const text = formData.get('task') as string;
    if (text) {
      const taskId = await createTask({ text });

      if (isAiParsingEnabled) {
        const reminder = await getParsedReminder(text);
        await createReminder({
          taskId: taskId,
          text: reminder.text,
          dueDate: reminder.dueDate
        });
        console.log('Parsed reminder:', reminder);
      }
      e.currentTarget.reset();
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Label
          htmlFor='task-input'
          className='block mb-2'
        >
          Add a new task
        </Label>

        <div className='flex gap-2'>
          <Input
            type='text'
            name='task'
            id='task-input'
            placeholder='Enter task here...'
            className='mb-4 md:w-full lg:w-1/2'
          />
          <Button type='submit'>Save</Button>
        </div>
      </form>
      {tasks?.map(({ _id, text, isCompleted }) => (
        <div
          className='flex items-center justify-between gap-3'
          key={_id}
        >
          {itemBeingEdited === _id ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const updatedText = formData.get('task') as string;
                if (updatedText) {
                  updateTask({ id: _id, isCompleted, text: updatedText });
                  setItemBeingEdited(null);
                }
              }}
            >
              <div className='flex'>
                <Input
                  type='text'
                  name='task'
                  defaultValue={text}
                  className='mr-2'
                  autoFocus
                />

                <div className='flex gap-1 justify-between'>
                  <Button
                    type='button'
                    variant={'secondary'}
                    onClick={() => setItemBeingEdited(null)}
                  >
                    Cancel
                  </Button>
                  <Button type='submit'>Update</Button>
                </div>
              </div>
            </form>
          ) : (
            <div className='flex gap-3'>
              <Checkbox
                id={_id}
                onCheckedChange={(checked) =>
                  updateTask({
                    id: _id,
                    isCompleted: checked === true
                  })
                }
                checked={isCompleted}
              />
              <Label
                htmlFor={_id}
                className={clsx({
                  'line-through': isCompleted,
                  'text-gray-500': isCompleted
                })}
              >
                {text}
              </Label>
            </div>
          )}

          <div className='flex gap-1 justify-between items-center'>
            <Button
              variant='secondary'
              size='icon'
              className='size-8'
              onClick={() => setModalInfo({ taskId: _id })}
              disabled={itemBeingEdited === _id}
            >
              <Clock />
            </Button>
            <Button
              variant='secondary'
              size='icon'
              className='size-8'
              onClick={() => setItemBeingEdited(_id)}
              disabled={itemBeingEdited === _id}
            >
              <Edit />
            </Button>
            <Button
              variant='secondary'
              size='icon'
              className='size-8'
              onClick={() => deleteTask({ id: _id })}
              disabled={itemBeingEdited === _id}
            >
              <Trash />
            </Button>
          </div>
        </div>
      ))}

      {modalInfo && (
        <AddReminder
          taskId={modalInfo.taskId}
          onClose={() => setModalInfo(null)}
        />
      )}
    </div>
  );
}
