import { useAuthActions } from '@convex-dev/auth/react';
import { Button } from './components/ui/button';
import { LogOut } from 'lucide-react';

export function SignOut() {
  const { signOut } = useAuthActions();
  return (
    <Button
      variant='secondary'
      size='icon'
      className='size-8'
      onClick={() => void signOut()}
    >
      <LogOut />
    </Button>
  );
}
