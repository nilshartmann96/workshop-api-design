import type { Customer, Address, CreateCustomerInput } from '../types/customer';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API Error: ${response.status} - ${error}`);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const customerApi = {
  getCustomers: async (): Promise<Customer[]> => {
    return fetchApi<Customer[]>('/customers/');
  },

  getCustomer: async (customerNumber: string): Promise<Customer> => {
    return fetchApi<Customer>(`/customers/${customerNumber}`);
  },

  createCustomer: async (customer: CreateCustomerInput): Promise<void> => {
    await fetchApi<void>('/customers/', {
      method: 'POST',
      body: JSON.stringify(customer),
    });
  },

  updateBillingAddress: async (customerNumber: string, address: Address): Promise<void> => {
    await fetchApi<void>(`/customers/${customerNumber}/billing-address`, {
      method: 'PUT',
      body: JSON.stringify(address),
    });
  },

  updateDeliveryAddress: async (customerNumber: string, address: Address): Promise<void> => {
    await fetchApi<void>(`/customers/${customerNumber}/delivery-address`, {
      method: 'PUT',
      body: JSON.stringify(address),
    });
  },
};
