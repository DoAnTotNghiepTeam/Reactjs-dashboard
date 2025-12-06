import { z } from 'zod';

import apiClient from '../../libs/api-client';
import { type MutationConfig, queryClient } from '../../libs/react-query';
import { useMutation } from '@tanstack/react-query';

export const createPostInputSchema = z.object({

});

export type CreateEmployerInput = z.infer<typeof createPostInputSchema>;

// 2. API call tạo employer
export const createEmployer = async (data: CreateEmployerInput) => {
  // validate bằng zod
  createPostInputSchema.parse(data);

  return (await apiClient.post(`/employees`, data)) as any;
};

type UseCreateEmployerOptions = {
  mutationConfig?: MutationConfig<typeof createEmployer>;
};

export const useCreateEmployer = (
  { mutationConfig }: UseCreateEmployerOptions = {}
) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: createEmployer,
    onSuccess: (data, variables, context) => {
      // Sau khi tạo thành công thì refetch lại danh sách employers
      queryClient.refetchQueries({ queryKey: ["employers"] });
      if (onSuccess) {
        onSuccess(data, variables, context);
      }
    },
    ...restConfig,
  });
};