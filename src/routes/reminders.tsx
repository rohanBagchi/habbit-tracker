import { createFileRoute } from '@tanstack/react-router';
import { api } from '../../convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';

export const Route = createFileRoute('/reminders')({
  component: RouteComponent
});

function RouteComponent() {
  const reminders = useQuery(api.reminders.getReminders);
  const deleteReminder = useMutation(api.reminders.deleteReminder);

  return (
    <div>
      Here are your reminders:
      <ul className='list-disc flex flex-col gap-1 pl-5'>
        {reminders?.map((reminder) => (
          <li
            key={reminder._id}
            className='flex items-center justify-between'
          >
            <div className='flex'>
              <strong>{reminder.text}</strong> - Due on{' '}
              {new Date(reminder.dueDate ?? '').toLocaleString()}
            </div>
            <Button
              variant='secondary'
              size='icon'
              className='size-8'
              onClick={() => deleteReminder({ id: reminder._id })}
            >
              <Trash />
            </Button>
          </li>
        ))}
      </ul>
      {reminders?.length === 0 && <p>No reminders found.</p>}
    </div>
  );
}
