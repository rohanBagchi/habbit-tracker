import { Authenticated, Unauthenticated, AuthLoading } from 'convex/react';
import { SignIn } from './SignIn';
import { SignOut } from './SignOut';
import { Todo } from './todos/Todo';

function App() {
  return (
    <div className='flex flex-col justify-center gap-6 w-1/2 mx-auto mt-10'>
      <AuthLoading>loading ...</AuthLoading>

      <Unauthenticated>
        <SignIn />
      </Unauthenticated>
      <Authenticated>
        <SignOut />
        <Todo />
      </Authenticated>
    </div>
  );
}

export default App;
