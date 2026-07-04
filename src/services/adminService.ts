/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { apiRequest } from './apiClient';

export interface AdminRegisterDto {
  email: string;
  firstName: string;
  lastName: string;
}

export interface AdminPlanDto {
  type: 'BASIC' | 'PREMIUM' | 'BONANZA';
  fee: number;
  maxDevices: number;
  summary: string;
  benefits: string[];
  isActive?: boolean;
}

export interface AdminInstitutionDto {
  name: string;
  shortName: string;
  location: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'DELETED';
}

export const adminService = {
  async register(body: AdminRegisterDto, secretCode: string) {
    return apiRequest<any>(`/admin/register?secretCode=${encodeURIComponent(secretCode)}`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  async removeAdmin(id: string) {
    return apiRequest<any>(`/admin/remove?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  },

  async getInstitutionDetails(institutionId: string) {
    return apiRequest<any>(`/admin/institution/details?institutionId=${encodeURIComponent(institutionId)}`);
  },

  async getSubscribers(limit?: number, cursor?: string) {
    const params = new URLSearchParams();
    if (limit) params.append('limit', String(limit));
    if (cursor) params.append('cursor', cursor);
    return apiRequest<any>(`/admin/subscribers?${params.toString()}`);
  },

  async getRevenue() {
    return apiRequest<any>('/admin/revenue');
  },

  async getDevices(limit?: number, cursor?: string) {
    const params = new URLSearchParams();
    if (limit) params.append('limit', String(limit));
    if (cursor) params.append('cursor', cursor);
    return apiRequest<any>(`/admin/devices?${params.toString()}`);
  },

  async getRequests(limit?: number, cursor?: string) {
    const params = new URLSearchParams();
    if (limit) params.append('limit', String(limit));
    if (cursor) params.append('cursor', cursor);
    return apiRequest<any>(`/admin/requests?${params.toString()}`);
  },

  async getPlans(limit?: number, cursor?: string) {
    const params = new URLSearchParams();
    if (limit) params.append('limit', String(limit));
    if (cursor) params.append('cursor', cursor);
    return apiRequest<any>(`/admin/plans?${params.toString()}`);
  },

  async getInstitutions(limit?: number, cursor?: string) {
    const params = new URLSearchParams();
    if (limit) params.append('limit', String(limit));
    if (cursor) params.append('cursor', cursor);
    return apiRequest<any>(`/admin/institutions?${params.toString()}`);
  },

  async updateRequestStatus(requestId: string, status: 'OPEN' | 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'DELIVERED') {
    return apiRequest<any>(
      `/admin/request/status?requestId=${encodeURIComponent(requestId)}&status=${status}`,
      {
        method: 'PATCH',
      }
    );
  },

  async addPlan(body: AdminPlanDto) {
    return apiRequest<any>('/admin/add/plan', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  async updatePlan(planId: string, body: Partial<AdminPlanDto>) {
    return apiRequest<any>(`/admin/update/plan?planId=${encodeURIComponent(planId)}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },

  async removePlan(planId: string) {
    return apiRequest<any>(`/admin/plan?planId=${encodeURIComponent(planId)}`, {
      method: 'DELETE',
    });
  },

  async bulkExpireSubscription(institutionId: string) {
    return apiRequest<any>(
      `/admin/subscription/expire-bulk?institutionId=${encodeURIComponent(institutionId)}`,
      {
        method: 'POST',
      }
    );
  },

  async bulkSuspendSubscription(institutionId: string) {
    return apiRequest<any>(
      `/admin/subscription/suspend-bulk?institutionId=${encodeURIComponent(institutionId)}`,
      {
        method: 'POST',
      }
    );
  },

  async addInstitution(body: AdminInstitutionDto) {
    return apiRequest<any>('/admin/add/institution', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  async updateInstitution(institutionId: string, body: Partial<AdminInstitutionDto>) {
    return apiRequest<any>(`/admin/institution?institutionId=${encodeURIComponent(institutionId)}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },

  async removeInstitution(institutionId: string) {
    return apiRequest<any>(`/admin/institution?institutionId=${encodeURIComponent(institutionId)}`, {
      method: 'DELETE',
    });
  },

  async getProfile() {
    return apiRequest<any>('/admin/profile');
  },
};
