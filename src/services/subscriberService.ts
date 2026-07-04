/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { apiRequest } from './apiClient';

export interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  gender?: 'MALE' | 'FEMALE';
  residence?: string;
  level?: number;
}

export const subscriberService = {
  async getProfile() {
    return apiRequest<any>('/subscriber/profile');
  },

  async updateProfile(body: UpdateProfileDto, file?: File) {
    const formData = new FormData();
    if (body.firstName) formData.append('firstName', body.firstName);
    if (body.lastName) formData.append('lastName', body.lastName);
    if (body.phone) formData.append('phone', body.phone);
    if (body.gender) formData.append('gender', body.gender);
    if (body.residence) formData.append('residence', body.residence);
    if (body.level) formData.append('level', String(body.level));

    if (file) {
      formData.append('profilePicture', file);
    }

    return apiRequest<any>('/subscriber/profile/update', {
      method: 'PATCH',
      body: formData,
    });
  },
};
