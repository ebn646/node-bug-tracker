// get data fro projects api
import useSWR from 'swr';
import { fetcher } from '../fetch';

export function useProjects() {
  const { data } = useSWR('/api/projects', fetcher) ;

  return {
      data
  }
}
