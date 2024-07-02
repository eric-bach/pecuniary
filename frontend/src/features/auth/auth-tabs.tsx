import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginForm from './login-form';
import RegisterForm from './register-form';

const AuthTabs = () => {
  return (
    <Tabs defaultValue='login' className='w-[400px]'>
      <TabsList className='grid w-full grid-cols-2'>
        <TabsTrigger value='login'>Sign In</TabsTrigger>
        <TabsTrigger value='register'>Create Account</TabsTrigger>
      </TabsList>
      <TabsContent value='login'>
        <LoginForm />
      </TabsContent>
      <TabsContent value='register'>
        <RegisterForm />
      </TabsContent>
    </Tabs>
  );
};

export default AuthTabs;
