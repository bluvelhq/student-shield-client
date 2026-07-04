/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { apiRequest } from './apiClient';

export const notificationService = {
  async getNotifications() {
    return apiRequest<any>('/notifications');
  },

  async readNotification(notificationId: string) {
    return apiRequest<any>(`/notifications/read?notificationId=${encodeURIComponent(notificationId)}`, {
      method: 'PATCH',
    });
  },

  async readAllNotifications() {
    return apiRequest<any>('/notifications/read-all', {
      method: 'PATCH',
    });
  },

  async deleteNotification(notificationId: string) {
    return apiRequest<any>(`/notifications/delete?notificationId=${encodeURIComponent(notificationId)}`, {
      method: 'DELETE',
    });
  },
};
