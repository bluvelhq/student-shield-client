/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { apiRequest } from './apiClient';

export const paymentService = {
  async retryCheckout(reference: string, amount: number) {
    return apiRequest<any>(
      `/payment/retry-checkout?reference=${encodeURIComponent(reference)}&amount=${amount}`,
      {
        method: 'POST',
      }
    );
  },

  async getPaymentHistory() {
    return apiRequest<any>('/payment/history');
  },

  async devActivatePayment(reference: string) {
    return apiRequest<any>(
      `/payment/dev-activate-payment?reference=${encodeURIComponent(reference)}`,
      {
        method: 'POST',
      }
    );
  },
};
