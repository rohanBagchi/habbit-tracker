import { Authenticated, Unauthenticated, AuthLoading } from 'convex/react';
import { SignIn } from './SignIn';
import { SignOut } from './SignOut';

function App({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex flex-col justify-center md:w-full sm:w-full lg:w-1/2 mx-auto mt-10'>
      <AuthLoading>loading ...</AuthLoading>

      <Unauthenticated>
        <SignIn />
      </Unauthenticated>
      <Authenticated>
        <SignOut />
        {children}
      </Authenticated>
    </div>
  );
}

export default App;
