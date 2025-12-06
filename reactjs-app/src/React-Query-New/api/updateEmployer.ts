import { z } from 'zod';

import apiClient from '../../libs/api-client'; 
import { type MutationConfig, queryClient } from '../../libs/react-query';

import { useMutation } from '@tanstack/react-query';

// Update the import path if the file is named differently or located elsewhere
import { getAllEmployersQueryOptions } from "./getAllEmployer";

export const updatePostInputSchema = z.object({
    ////
});

export type UpdateEmployerInput = z.infer<typeof updatePostInputSchema>;

export const updateEmployer = async ({ id, data }: { id: string; data: UpdateEmployerInput }) => {
  return (await apiClient.put(`/employees/${id}`, data)) as any;
};

type UseUpdateEmployerOptions = {
  mutationConfig?: MutationConfig<typeof updateEmployer>;
};

// hook cho update employer
export const useUpdateEmployer = ({
  mutationConfig,
}: UseUpdateEmployerOptions = {}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, variables, context) => {
      // update single employer cache
      queryClient.setQueryData(
        getAllEmployersQueryOptions().queryKey,
        data
      );

      // update employers list cache
      queryClient.setQueryData(
        getAllEmployersQueryOptions().queryKey,
        (old: any) => {
          if (!old) return old;

          // nếu employers trả về là array
          if (Array.isArray(old)) {
            return old.map((x) => (x.id === data.id ? data : x));
          }

          // nếu employers trả về có dạng object { data: [] } (pagination)
          if (old.data && Array.isArray(old.data)) {
            return {
              ...old,
              data: old.data.map((x: any) => (x.id === data.id ? data : x)),
            };
          }

          return old;
        }
      );

      if (onSuccess) {
        onSuccess(data, variables, context);
      }
    },
    ...restConfig,
    mutationFn: updateEmployer,
  });
};