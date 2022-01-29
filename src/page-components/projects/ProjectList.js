import React from 'react';
import { useProjects } from '../../../lib/project';

export default function ProjectList() {
    const { data } = useProjects();

  return <div>{JSON.stringify(data, null, 2)}</div>;
}
