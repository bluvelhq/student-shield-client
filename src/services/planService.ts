/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { apiRequest } from './apiClient';

export const planService = {
  async getPlanDetails(planId: string) {
    return apiRequest<any>(`/plans/details?planId=${encodeURIComponent(planId)}`);
  },

  async getMyPlan() {
    return apiRequest<any>('/plans/my-plan');
  },

  async renewPlan(planId: string) {
    return apiRequest<any>(`/plans/renew?planId=${encodeURIComponent(planId)}`, {
      method: 'POST',
    });
  },

  async upgradePlan(planId: string) {
    return apiRequest<any>(`/plans/upgrade?planId=${encodeURIComponent(planId)}`, {
      method: 'POST',
    });
  },
};
