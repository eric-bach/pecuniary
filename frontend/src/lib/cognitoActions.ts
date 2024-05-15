import { redirect } from 'next/navigation';
import { signUp, confirmSignUp, signIn, signOut, resendSignUpCode, autoSignIn } from 'aws-amplify/auth';
import { getErrorMessage } from '@/utils/get-error-message';
import { nextRedirect } from '@/utils/amplify-server-utils';

export async function handleSignUp(prevState: string | undefined, formData: FormData) {
  try {
    const { isSignUpComplete, userId, nextStep } = await signUp({
      username: String(formData.get('email')),
      password: String(formData.get('password')),
      options: {
        userAttributes: {
          email: String(formData.get('email')),
          name: String(formData.get('name')),
        },
        // optional
        autoSignIn: true,
      },
    });
  } catch (error) {
    return getErrorMessage(error);
  }
  redirect('/auth/verify');
}

export async function handleSendEmailVerificationCode(prevState: { message: string; errorMessage: string }, formData: FormData) {
  let currentState;
  try {
    await resendSignUpCode({
      username: String(formData.get('email')),
    });
    currentState = {
      ...prevState,
      message: 'Code sent successfully',
    };
  } catch (error) {
    currentState = {
      ...prevState,
      errorMessage: getErrorMessage(error),
    };
  }

  return currentState;
}

export async function handleConfirmSignUp(prevState: string | undefined, formData: FormData) {
  try {
    const { isSignUpComplete, nextStep } = await confirmSignUp({
      username: String(formData.get('email')),
      confirmationCode: String(formData.get('code')),
    });

    autoSignIn();
  } catch (error) {
    return getErrorMessage(error);
  }
  redirect('/auth/login');
}

export async function handleSignIn(prevState: string | undefined, formData: FormData) {
  let redirectLink = '/dashboard';
  try {
    console.log(formData.get('email'));
    const { isSignedIn, nextStep } = await signIn({
      username: String(formData.get('email')),
      password: String(formData.get('password')),
    });
    if (nextStep.signInStep === 'CONFIRM_SIGN_UP') {
      await resendSignUpCode({
        username: String(formData.get('email')),
      });
      redirectLink = '/auth/verify';
    }
  } catch (error) {
    return getErrorMessage(error);
  }

  redirect(redirectLink);
}

export async function handleSignOut() {
  try {
    await signOut();
  } catch (error) {
    console.log(getErrorMessage(error));
    return false;
  }

  // NOTE: redirect can only be used in a Client Component through a Server Action
  // https://nextjs.org/docs/app/api-reference/functions/redirect#client-component
  nextRedirect('/auth/login');
}
