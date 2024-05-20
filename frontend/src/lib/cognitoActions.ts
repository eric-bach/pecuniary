import { redirect } from 'next/navigation';
import {
  signUp,
  confirmSignUp,
  signIn,
  signOut,
  resendSignUpCode,
  autoSignIn,
  updateUserAttribute,
  UpdateUserAttributeOutput,
  updatePassword,
  resetPassword,
  confirmResetPassword,
} from 'aws-amplify/auth';
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
  redirect('/auth/verify?email=' + encodeURIComponent(String(formData.get('email'))));
}

export async function handleSendEmailVerification(prevState: { message: string; errorMessage: string }, formData: FormData) {
  let currentState;
  try {
    // Sends verificaiton email (despite the funciton name saying 'code')
    await resendSignUpCode({
      username: String(formData.get('email')),
    });
    currentState = {
      ...prevState,
      message: 'Verification email sent successfully',
    };
  } catch (error) {
    currentState = {
      ...prevState,
      errorMessage: getErrorMessage(error),
    };
  }

  return currentState;
}

export async function handleSignIn(prevState: string | undefined, formData: FormData) {
  let redirectLink = '/dashboard';
  try {
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

  nextRedirect(redirectLink);
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
  nextRedirect('/');
}

export async function handleUpdatePassword(prevState: 'success' | 'error' | undefined, formData: FormData) {
  const currentPassword = formData.get('current_password');
  const newPassword = formData.get('new_password');

  if (currentPassword === newPassword) {
    return;
  }

  try {
    await updatePassword({
      oldPassword: String(currentPassword),
      newPassword: String(newPassword),
    });
  } catch (error) {
    console.log(error);
    return 'error';
  }

  return 'success';
}

export async function handleResetPassword(prevState: string | undefined, formData: FormData) {
  try {
    await resetPassword({ username: String(formData.get('email')) });
  } catch (error) {
    return getErrorMessage(error);
  }
  redirect('/auth/reset-password/confirm');
}

export async function handleConfirmResetPassword(prevState: string | undefined, formData: FormData) {
  try {
    await confirmResetPassword({
      username: String(formData.get('email')),
      confirmationCode: String(formData.get('code')),
      newPassword: String(formData.get('password')),
    });
  } catch (error) {
    return getErrorMessage(error);
  }
  redirect('/auth/login');
}
