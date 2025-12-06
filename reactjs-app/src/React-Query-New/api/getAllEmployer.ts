import apiClient from '../../libs/api-client';
import { queryOptions, useQuery } from '@tanstack/react-query';
import type { QueryConfig } from '../../libs/react-query';


export const getAllEmployers = async (): Promise<any> => {
  return apiClient.get('/employees');
};

export const getAllEmployersQueryOptions = () => {
  return queryOptions({
    queryKey: [ 'employees', 'all'],
    queryFn: () => getAllEmployers(),
  });
};

export const useAllEmployers = (queryConfig?: QueryConfig<typeof getAllEmployersQueryOptions>) => {
  return useQuery({
    ...getAllEmployersQueryOptions(),
    ...queryConfig,
  });
};
