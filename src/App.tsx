import { Authenticated, Unauthenticated, AuthLoading } from 'convex/react';
import { SignIn } from './SignIn';

function App({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex flex-col justify-center mt-10'>
      <AuthLoading>loading ...</AuthLoading>

      <Unauthenticated>
        <SignIn />
      </Unauthenticated>
      <Authenticated>{children}</Authenticated>
    </div>
  );
}

export default App;
