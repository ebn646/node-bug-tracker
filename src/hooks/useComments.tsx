import useSWR from 'swr';


import {fetcher} from '../../lib/fetch'

export default function useComments() {
  return useSWR('/api/data', fetcher)
}