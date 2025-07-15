import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList
} from '@/components/ui/navigation-menu';
import { Toaster } from '@/components/ui/sonner';
import { SignOut } from '@/SignOut';
import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

export const Route = createRootRoute({
  component: () => (
    <>
      <NavMenu />

      <div className='mt-5'>
        <Outlet />
      </div>
      <Toaster />
      <TanStackRouterDevtools />
    </>
  )
});

function NavMenu() {
  return (
    <div className='fixed top-0 left-0 right-0 z-50 bg-background border-b w-full flex justify-between items-center px-4 py-2'>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link
                to='/'
                className='[&.active]:font-bold'
              >
                Home
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link
                to='/reminders'
                className='[&.active]:font-bold'
              >
                Reminders
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link
                to='/draw'
                className='[&.active]:font-bold'
              >
                Draw
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <SignOut />
    </div>
  );
}
