// UI/UI/Components/Layout/Forms/SetupForm/index.tsx
// Form for initial setup of Admin user, App Name, Theme
import React, { useState, useEffect } from 'react';
import { Form } from 'UI/Components/Style/Form';

interface FormData {
  username: string;
  password: string;
}

const AuthError = `GraphQL error: Access denied! You don't have permission for this action!`;

type Invalid = { Field: string; Text: string } | { Field: ''; Text: undefined };

export function LoginForm(): React.ReactElement {
  const [invalid, setInvalid] = useState<Invalid>({ Field: '', Text: undefined });

  const onSubmit = async (data: FormData): Promise<void> => {
    const response = 
    if (response) window.location.href = '/';
  };

  useEffect(() => {
    if (typeof error !== 'undefined') {
      if (error.message === AuthError) setInvalid({ Field: 'password', Text: 'Password is Invalid' });
      else if (error.graphQLErrors[0].extensions && error.graphQLErrors[0].extensions.code === 'INVALID_USER')
        setInvalid({ Field: 'username', Text: 'Username is invalid' });
    }
  }, [error]);

  return (
    <Form<FormData>
      title='Login'
      invalid={invalid}
      onSubmit={onSubmit}
      Fields={[
        { label: 'Username', name: 'username', type: 'Text', inputType: 'text', autoComplete: 'username' },
        { label: 'Password', name: 'password', type: 'Text', inputType: 'password', autoComplete: 'current-password' }
      ]}
    />
  );
}
