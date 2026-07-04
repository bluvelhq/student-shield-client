/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { apiRequest } from './apiClient';
import { Institution, Plan } from '../types';

export interface SubscriberSignUpData {
  email: string;
  firstName: string;
  lastName: string;
  studentId?: string;
  level?: number;
  phone: string;
  residence: string;
  gender: 'MALE' | 'FEMALE';
}

export interface LoginResponse {
  message: string;
  token: string;
  data: any;
}

export const authService = {
  async subscribe(
    payload: SubscriberSignUpData,
    planId: string,
    institutionId: string
  ) {
    return apiRequest<any>(
      `/auth/subscribe?planId=${encodeURIComponent(planId)}&institutionId=${encodeURIComponent(institutionId)}`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    );
  },

  async login(serviceId: string, role: 'SUBSCRIBER' | 'ADMIN') {
    return apiRequest<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ serviceId, privilege: role }),
    });
  },

  async logout(id: string, role: 'SUBSCRIBER' | 'ADMIN') {
    return apiRequest<any>(
      `/auth/logout?id=${encodeURIComponent(id)}&role=${encodeURIComponent(role)}`,
      {
        method: 'POST',
      }
    );
  },

  async resetPassword(email: string, role: 'SUBSCRIBER' | 'ADMIN') {
    return apiRequest<any>(
      `/auth/reset-password?email=${encodeURIComponent(email)}&role=${encodeURIComponent(role)}`,
      {
        method: 'POST',
      }
    );
  },

  async removeAccount(id: string, role: 'SUBSCRIBER' | 'ADMIN') {
    return apiRequest<any>(
      `/auth/remove-account?id=${encodeURIComponent(id)}&role=${encodeURIComponent(role)}`,
      {
        method: 'DELETE',
      }
    );
  },

  async deactivateAccount(id: string, role: 'SUBSCRIBER' | 'ADMIN') {
    return apiRequest<any>(
      `/auth/deactivate-account?id=${encodeURIComponent(id)}&role=${encodeURIComponent(role)}`,
      {
        method: 'PATCH',
      }
    );
  },

  async requestResetToken(email: string, role: 'SUBSCRIBER' | 'ADMIN') {
    return apiRequest<any>(
      `/auth/request-reset-token?email=${encodeURIComponent(email)}&role=${encodeURIComponent(role)}`,
      {
        method: 'POST',
      }
    );
  },

  async getPlans() {
    return apiRequest<Plan[]>('/auth/plans');
  },

  async getInstitutions() {
    return apiRequest<Institution[]>('/auth/institutions');
  },
};
