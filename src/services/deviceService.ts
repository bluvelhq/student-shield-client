/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { apiRequest } from './apiClient';

export interface DeviceDto {
  type: 'LAPTOP' | 'MOBILE_PHONE' | 'DESKTOP' | 'TABLET' | 'OTHER';
  model?: string;
  serialCode?: string;
  name?: string;
  brand?: string;
  os?: string;
  attributes?: { key: string; value: string }[];
}

export const deviceService = {
  async addDevice(body: DeviceDto, mediaFiles?: File[]) {
    const formData = new FormData();
    formData.append('type', body.type);
    if (body.model) formData.append('model', body.model);
    if (body.serialCode) formData.append('serialCode', body.serialCode);
    if (body.name) formData.append('name', body.name);
    if (body.brand) formData.append('brand', body.brand);
    if (body.os) formData.append('os', body.os);
    if (body.attributes && body.attributes.length > 0) {
      body.attributes.forEach((attr) => {
        formData.append('customDeviceFieldsKeys', attr.key);
        formData.append('customDeviceFieldsValues', attr.value);
      });
    }
    
    if (mediaFiles && mediaFiles.length > 0) {
      mediaFiles.forEach((file) => {
        formData.append('media', file);
      });
    }

    return apiRequest<any>('/devices/add', {
      method: 'POST',
      body: formData,
    });
  },

  async getDeviceDetails(deviceId: string) {
    return apiRequest<any>(`/devices/details?deviceId=${encodeURIComponent(deviceId)}`);
  },

  async editDevice(deviceId: string, body: Partial<DeviceDto>, mediaFiles?: File[]) {
    const formData = new FormData();
    if (body.type) formData.append('type', body.type);
    if (body.model) formData.append('model', body.model);
    if (body.serialCode) formData.append('serialCode', body.serialCode);
    if (body.name) formData.append('name', body.name);
    if (body.brand) formData.append('brand', body.brand);
    if (body.os) formData.append('os', body.os);
    if (body.attributes && body.attributes.length > 0) {
      body.attributes.forEach((attr) => {
        formData.append('customDeviceFieldsKeys', attr.key);
        formData.append('customDeviceFieldsValues', attr.value);
      });
    }

    if (mediaFiles && mediaFiles.length > 0) {
      mediaFiles.forEach((file) => {
        formData.append('media', file);
      });
    }

    return apiRequest<any>(`/devices/edit?deviceId=${encodeURIComponent(deviceId)}`, {
      method: 'PATCH',
      body: formData,
    });
  },

  async removeDevice(deviceId: string) {
    return apiRequest<any>(`/devices/remove?deviceId=${encodeURIComponent(deviceId)}`, {
      method: 'DELETE',
    });
  },

  async getDevices() {
    return apiRequest<any>('/devices/list');
  },
};
