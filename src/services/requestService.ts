/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { apiRequest } from './apiClient';

export interface RequestDto {
  type: string;
  title: string;
  description?: string;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  businessName?: string;
  desiredSubdomain?: string;
  websiteConceptDescription?: string;
  websitePageCount?: number;
  preferHosting?: boolean;
  receipt?: string;
}

export const requestService = {
  async createRequest(body: RequestDto, deviceId?: string) {
    const query = deviceId ? `?deviceId=${encodeURIComponent(deviceId)}` : '';
    return apiRequest<any>(`/requests/create${query}`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  async getRequestDetails(requestId: string) {
    return apiRequest<any>(`/requests/details?requestId=${encodeURIComponent(requestId)}`);
  },

  async getSubscriberRequests() {
    return apiRequest<any>('/requests/list');
  },

  async updateRequest(requestId: string, body: Partial<RequestDto>, deviceId?: string) {
    const params = new URLSearchParams({ requestId });
    if (deviceId) {
      params.append('deviceId', deviceId);
    }
    return apiRequest<any>(`/requests/update?${params.toString()}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },

  async deleteRequest(requestId: string) {
    return apiRequest<any>(`/requests/delete?requestId=${encodeURIComponent(requestId)}`, {
      method: 'DELETE',
    });
  },
};
