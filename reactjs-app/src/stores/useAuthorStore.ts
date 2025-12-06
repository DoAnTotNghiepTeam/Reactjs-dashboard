/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NavigateFunction } from 'react-router';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import apiClient from '../libs/apt-client-simple';

export interface LoggedInUser {
  id: string | number;
  email: string;
  fullName: string;
  username: string;
  status: string;
  roles: string[]; // Theo response login là mảng string
}

export interface AuthState {
  access_token?: string;
  refresh_token?: string;
  loggedInUser?: LoggedInUser;  
  loading: boolean;
  error: any;
  login: ({ username, password, navigate }: { username: string; password: string; navigate: NavigateFunction }) => Promise<void>;
  logOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        access_token: undefined,
        refresh_token: undefined,
        loggedInUser: undefined,
        loading: false,
        error: null,
        login: async ({ username, password, navigate }) => {
          try {
            set(
              {
                loggedInUser: undefined,
                access_token: undefined,
                refresh_token: undefined,
                error: null,
                loading: true,
              },
              false,
              { type: '@AUTH/LOGIN/LOADING' }
            );

            const response: any = await apiClient.post('api/auth/login', { username, password });
            console.log('Login response:', response);

            set(
              {
                access_token: response.access_token,
                refresh_token: response.refresh_token,
                loggedInUser: response.loggedInUser,  // loggedInUser.roles là mảng role
                loading: false,
                error: null,
              },
              false,
              { type: '@AUTH/LOGIN/SUCCESS' }
            );
            navigate('/dashboard');
          } catch (error) {
            set({ error, access_token: undefined, refresh_token: undefined, loggedInUser: undefined }, false, {
              type: '@AUTH/LOGIN/ERROR',
            });
          }
        },

        logOut: async () => {
          set({ access_token: undefined, refresh_token: undefined, loggedInUser: undefined });
        },
      }),
      {
        name: 'auth-storage-for-login',
      }
    )
  )
);