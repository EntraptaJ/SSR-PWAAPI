// UI/UI/Components/Style/Form/index.tsx
import React, { PropsWithChildren, CSSProperties } from 'react';
import { Box } from 'UI/Components/Style/Box';
import useForm from 'react-hook-form';

import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';
import { BaseButton } from 'UI/Components/Style/Buttons/BaseButton';
import { FormProps } from './type';

const FieldStyle: CSSProperties = { marginTop: '1em', width: '100%' };

export function Form<T>({
  title,
  children,
  onSubmit,
  noSubmit = false,
  Fields,
  invalid = undefined,
  submitLabel = title
}: PropsWithChildren<FormProps<T>>): React.ReactElement {
  const { register, handleSubmit } = useForm<T>();

  const isInvalid = (fieldName: string): boolean => (invalid ? invalid.invalidField === fieldName : false);

  return (
    // @ts-ignore
    <Box title={title} component='form' onSubmit={handleSubmit(onSubmit)}>
      {invalid && (
        <FormHelperText error style={{ color: '#b00020' }}>
          {invalid.errorMessage}
        </FormHelperText>
      )}

      {Fields.map(({ registerOpts, inputType, type, ...props }) => (
        <TextField
          key={props.name}
          type={inputType}
          variant='outlined'
          style={FieldStyle}
          error={isInvalid(props.name)}
          inputRef={registerOpts ? register(registerOpts) : register}
          {...props}
        />
      ))}
      {children}
      {!noSubmit && <BaseButton color='primary' fullWidth variant='contained' submit label={submitLabel} />}
    </Box>
  );
}
