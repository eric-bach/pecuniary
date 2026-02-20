import { createFileRoute, Outlet } from '@tanstack/react-router';
import {
  Authenticator,
  Button,
  Heading,
  Theme,
  ThemeProvider,
  useAuthenticator,
  useTheme,
  View,
} from '@aws-amplify/ui-react';
import { AlertCircle, CircleDollarSign, Youtube, LayoutDashboard } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';
import { Link, useLocation } from '@tanstack/react-router';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarRail,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const Route = createFileRoute('/_auth')({
  component: AuthLayout,
});

function AuthLayout() {
  // Use test key for localhost, environment variable for production
  const turnstileSiteKey =
    typeof window !== 'undefined' && window.location.hostname === 'localhost'
      ? '1x00000000000000000000AA'
      : process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!;

  const location = useLocation();

  const navItems = [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: LayoutDashboard,
      exact: false,
    },
  ];

  const { tokens } = useTheme();

  const theme: Theme = {
    name: 'Pecuniary Theme',
    tokens: {
      components: {
        authenticator: {
          router: {
            boxShadow: `0 0 16px ${tokens.colors.overlay['10']}`,
            borderWidth: '0',
          },
          form: {
            padding: `${tokens.space.medium} ${tokens.space.xl} ${tokens.space.medium}`,
          },
        },
        button: {
          primary: {
            backgroundColor: '#0067c0',
          },
          link: {
            color: '#0067c0',
          },
        },
        fieldcontrol: {
          _focus: {
            boxShadow: `0 0 0 2px #0067c0`,
          },
        },
        tabs: {
          item: {
            color: tokens.colors.neutral['80'],
            _active: {
              borderColor: tokens.colors.neutral['100'],
              color: '#0067c0',
            },
          },
        },
      },
    },
  };

  const components = {
    Header() {
      const { tokens } = useTheme();

      return (
        <View
          textAlign='center'
          padding={tokens.space.large}
          paddingTop='6rem'
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div className='flex justify-center'>
            <div className='p-4 bg-white rounded-2xl shadow-md border border-gray-100'>
              <CircleDollarSign className='w-12 h-12 text-red-600' />
            </div>
          </div>
          <Heading level={4}>Pecuniary</Heading>
        </View>
      );
    },

    SignIn: {
      Header() {
        const { tokens } = useTheme();

        return (
          <Heading padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`} level={4}>
            Sign in to your account
          </Heading>
        );
      },
      Footer() {
        const { toForgotPassword } = useAuthenticator();
        const [turnstileStatus, setTurnstileStatus] = useState<'success' | 'error' | 'expired' | 'required'>(
          'required',
        );
        const [error, setError] = useState<string | null>(null);

        // Effect to disable the Sign in button until turnstile is successful
        useEffect(() => {
          const disableSignInButton = () => {
            // Target the specific Amplify button with the exact classes you provided
            const signInButton = document.querySelector(
              'button.amplify-button.amplify-field-group__control.amplify-button--primary[type="submit"]',
            ) as HTMLButtonElement;

            if (signInButton && signInButton.textContent?.trim() === 'Sign in') {
              const shouldDisable = turnstileStatus !== 'success';

              signInButton.disabled = shouldDisable;
              signInButton.style.opacity = shouldDisable ? '0.5' : '1';
              signInButton.style.cursor = shouldDisable ? 'not-allowed' : 'pointer';

              if (shouldDisable) {
                signInButton.title = 'Please complete the security check first';
              } else {
                signInButton.removeAttribute('title');
              }
            }
          };

          // Run immediately and then set up an interval to check periodically
          disableSignInButton();
          const interval = setInterval(disableSignInButton, 500);

          return () => clearInterval(interval);
        }, [turnstileStatus]);

        return (
          <View textAlign='center'>
            <Turnstile
              siteKey={turnstileSiteKey}
              onError={() => {
                setTurnstileStatus('error');
                setError('Security check failed. Please try again.');
              }}
              onExpire={() => {
                setTurnstileStatus('expired');
                setError('Security check expired. Please verify again.');
              }}
              onSuccess={() => {
                setTurnstileStatus('success');
                setError(null);
              }}
            />
            {error && (
              <div className='flex items-center gap-2 text-red-500 text-sm mb-2' aria-live='polite'>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}
            {turnstileStatus === 'success' && (
              <Button fontWeight='normal' onClick={toForgotPassword} size='small' variation='link'>
                Reset Password
              </Button>
            )}
            {turnstileStatus !== 'success' && (
              <div className='text-sm text-gray-500 mb-2'>Please complete the security check above</div>
            )}
          </View>
        );
      },
    },

    SignUp: {
      Header() {
        const { tokens } = useTheme();

        return (
          <Heading padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`} level={4}>
            Create a new account
          </Heading>
        );
      },
      Footer() {
        const { toSignIn } = useAuthenticator();
        const [turnstileStatus, setTurnstileStatus] = useState<'success' | 'error' | 'expired' | 'required'>(
          'required',
        );
        const [error, setError] = useState<string | null>(null);

        // Effect to disable the Sign up button until turnstile is successful
        useEffect(() => {
          const disableSignUpButton = () => {
            // Target the specific Amplify button with the exact classes you provided
            const signUpButton = document.querySelector(
              'button.amplify-button.amplify-field-group__control.amplify-button--primary.amplify-button--fullwidth[type="submit"]',
            ) as HTMLButtonElement;

            if (signUpButton && signUpButton.textContent?.trim() === 'Create Account') {
              const shouldDisable = turnstileStatus !== 'success';

              signUpButton.disabled = shouldDisable;
              signUpButton.style.opacity = shouldDisable ? '0.5' : '1';
              signUpButton.style.cursor = shouldDisable ? 'not-allowed' : 'pointer';

              if (shouldDisable) {
                signUpButton.title = 'Please complete the security check first';
              } else {
                signUpButton.removeAttribute('title');
              }
            }
          };

          // Run immediately and then set up an interval to check periodically
          disableSignUpButton();
          const interval = setInterval(disableSignUpButton, 500);

          return () => clearInterval(interval);
        }, [turnstileStatus]);

        return (
          <View textAlign='center'>
            <Turnstile
              siteKey={turnstileSiteKey}
              onError={() => {
                setTurnstileStatus('error');
                setError('Security check failed. Please try again.');
              }}
              onExpire={() => {
                setTurnstileStatus('expired');
                setError('Security check expired. Please verify again.');
              }}
              onSuccess={() => {
                setTurnstileStatus('success');
                setError(null);
              }}
            />
            {error && (
              <div className='flex items-center gap-2 text-red-500 text-sm mb-2' aria-live='polite'>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}
            {turnstileStatus === 'success' && (
              <Button fontWeight='normal' onClick={toSignIn} size='small' variation='link'>
                Back to Sign In
              </Button>
            )}
            {turnstileStatus !== 'success' && (
              <div className='text-sm text-gray-500 mb-2'>Please complete the security check above</div>
            )}
          </View>
        );
      },
    },
  };

  const formFields = {
    signUp: {
      username: {
        label: 'Email:',
        placeholder: 'Enter your email',
        order: 1,
      },
      password: {
        order: 2,
      },
      confirm_password: {
        order: 3,
      },
    },
  };

  return (
    <ThemeProvider theme={theme}>
      <Authenticator formFields={formFields} components={components}>
        {({ signOut, user }) => (
          <SidebarProvider>
            {/* Full-width sticky top navbar */}
            <header className='fixed top-0 left-0 right-0 z-50 flex h-16 items-center border-b bg-background px-4 sm:px-6 shadow-sm justify-between'>
              <div className='flex items-center gap-2'>
                <SidebarTrigger className='-ml-2 mr-2' />
                <h1 className='text-lg font-semibold capitalize'>
                  <Link to='/dashboard'>Pecuniary</Link>
                </h1>
              </div>
              <div className='flex items-center gap-4'>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className='rounded-full outline-none focus:ring-2 focus:ring-blue-500'>
                      <Avatar>
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`} />
                        <AvatarFallback>{user?.signInDetails?.loginId}</AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end' className='w-56'>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem disabled>
                      <span className='font-semibold text-xs mt-1 truncate'>{user?.signInDetails?.loginId}</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={signOut}
                      className='text-[#0067c0] focus:text-[#005bb5] focus:bg-blue-50 cursor-pointer'
                    >
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </header>

            {/* Main Layout Body - Account for 16 (4rem) header */}
            <div className='flex min-h-screen w-full bg-background pt-16'>
              {/*
                Override the default fixed inset-y-0 h-svh of the sidebar
                to start below the 4rem header and take the remaining height.
              */}
              <Sidebar className='top-16 border-r !h-[calc(100svh-4rem)]'>
                <SidebarContent>
                  <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                      <SidebarMenu>
                        {navItems.map((item) => (
                          <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                              asChild
                              isActive={
                                item.exact ? location.pathname === item.url : location.pathname.startsWith(item.url)
                              }
                            >
                              <Link to={item.url}>
                                <item.icon />
                                <span>{item.title}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </SidebarGroup>
                </SidebarContent>
                <SidebarRail />
              </Sidebar>

              <div className='flex flex-col w-full min-w-0'>
                <main className='flex-1 p-4'>
                  <Outlet />
                </main>
              </div>
            </div>
          </SidebarProvider>
        )}
      </Authenticator>
    </ThemeProvider>
  );
}
