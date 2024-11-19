// frontend/src/app/services/organizationService.ts
import api from './api';
import { IOrganization } from '@shared/types';

export const getOrganizations = async (limit?: number, searchQuery?: string) => {
  let url = '/organizations/query';
  const params = new URLSearchParams();

  if (limit) {
    params.append('limit', limit.toString());
  }

  if (searchQuery) {
    params.append('search', searchQuery);
  }

  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  const response = await api.get(url);
  return response.data;
};

export const getOrganizationById = async (id: string): Promise<IOrganization> => {
  const response = await api.get(`/organizations/${id}`);
  return response.data;
};