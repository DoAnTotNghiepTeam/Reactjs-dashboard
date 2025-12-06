import { z } from 'zod';

import apiClient from '../../libs/api-client';
import { type MutationConfig, queryClient } from '../../libs/react-query';
import { useMutation } from '@tanstack/react-query';

import { getAllEmployersQueryOptions } from "./getAllEmployer";

export const deleteEmployerInputSchema = z.object({});

export type DeleteEmployerInput = z.infer<typeof deleteEmployerInputSchema>;

type Params = {
  id: string | number;
};
export const deleteEmployer = async ({ id }: Params) => {
  return (await apiClient.delete(`/employees/${id}`)) as any;
};

type UseDeleteEmployerOptions = {
  mutationConfig?: MutationConfig<typeof deleteEmployer>;
};

export const useDeleteEmployer = ({ mutationConfig }: UseDeleteEmployerOptions = {}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, variables, context) => {
      // Update react-query-cached list of employers, don't refetch data from server
      queryClient.setQueryData(getAllEmployersQueryOptions().queryKey, (old: any) => {
        if (!old) {
          return old;
        }
        // If employers are in an array, remove the matching one
        if (Array.isArray(old)) {
          return old.filter((x) => x.id !== data.id);
        }
        // If employers are in an object with a 'data' property (pagination)
        if (old.data && Array.isArray(old.data)) {
          return {
            ...old,
            data: old.data.filter((x: any) => x.id !== data.id),
          };
        }
        return old;
      });

      if (onSuccess) {
        onSuccess(data, variables, context);
      }
    },
    ...restConfig,
    mutationFn: deleteEmployer,
  });
};
