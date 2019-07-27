// UI/UI/Components/Providers/SessionProvider/index.tsx
// KristianFJones <me@kristianjones.xyz>
import React, { createContext, useContext, FunctionComponent } from 'react';
import { useQuery, useMutation, useApolloClient } from '@apollo/react-hooks';
import ISAUTHED_GQL from 'UI/GraphQL/isAuthed.graphql';
import LOGIN_GQL from 'UI/GraphQL/loginUser.graphql';
import { useCookies } from 'react-cookie';
import { MutationResult } from '@apollo/react-common';

export interface Session {
  isAuthed: boolean;
  recheck: () => Promise<any>;
}

const SessionContext = createContext<Session>({
  isAuthed: false,
  recheck: async () => {}
});

type useIsAuthedType = () => { isAuthed: boolean; recheck: () => Promise<void> };

export const useIsAuthed: useIsAuthedType = () => {
  const { data, loading, refetch } = useQuery<{ isAuthed: boolean }>(ISAUTHED_GQL);
  const client = useApolloClient();
  const isAuthed = !loading && data ? data.isAuthed : false;
  const recheck = async (): Promise<void> => {
    await client.cache.reset();
    await refetch();
  };
  return { isAuthed, recheck };
};

const SessionProvider: FunctionComponent = ({ children }) => {
  const { isAuthed, recheck } = useIsAuthed();
  const sessionValue: Session = { isAuthed, recheck };
  return <SessionContext.Provider value={sessionValue}>{children}</SessionContext.Provider>;
};

export default SessionProvider;

export const useSession = (): Session => {
  return useContext(SessionContext);
};

interface User {
  username: string;
  password: string;
}

interface LoginUserResponse {
  success: boolean;
  token: string;
}

type LoginType = (user: User) => Promise<boolean>;

type setToken = (token?: string) => void;
type deleteToken = () => void;

export const useToken = (): [string, setToken, deleteToken] => {
  const [token, setCookieToken, deleteCookieToken] = useCookies();
  const setToken = (token?: string): void => setCookieToken('token', token, { path: '/' });
  const deleteToken = (): void => deleteCookieToken('token');
  return [token['token'], setToken, deleteToken];
};

export const useLogin = (): [LoginType, MutationResult] => {
  const [, setToken] = useToken();
  const [loginUser, { ...extra }] = useMutation<{ loginUser: LoginUserResponse }, User>(LOGIN_GQL);
  const LoginFN: LoginType = async ({ username, password }) => {
    const response = await loginUser({ variables: { username, password } });
    if (response && response.data && response.data.loginUser.success) {
      setToken(response.data.loginUser.token);
      return true;
    } else return false;
  };
  return [LoginFN, { ...extra }];
};

export const useLogout = (): [() => Promise<void>] => {
  const [, , deleteToken] = useToken();
  const LogoutFN = async (): Promise<void> => {
    await deleteToken();
    window.location.href = '/';
  };
  return [LogoutFN];
};
