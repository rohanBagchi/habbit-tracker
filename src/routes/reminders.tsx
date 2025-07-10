import { createFileRoute } from '@tanstack/react-router';
import { api } from '../../convex/_generated/api';
import { useQuery } from 'convex/react';

export const Route = createFileRoute('/reminders')({
  component: RouteComponent
});

function RouteComponent() {
  const reminders = useQuery(api.reminders.getReminders);

  return (
    <div>
      Here are your reminders:
      <ul className='list-disc pl-5'>
        {reminders?.map((reminder) => (
          <li key={reminder._id}>
            <strong>{reminder.text}</strong> - Due on{' '}
            {new Date(reminder.dueDate ?? '').toLocaleString()}
          </li>
        ))}
      </ul>
      {reminders?.length === 0 && <p>No reminders found.</p>}
    </div>
  );
}
