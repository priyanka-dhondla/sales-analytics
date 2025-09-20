const API_BASE_URL = "/api";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

class ApiService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Analytics endpoints
  async generateAnalytics(startDate: Date, endDate: Date) {
    const params = new URLSearchParams({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });

    return this.makeRequest(`/analytics/generate?${params}`);
  }

  async getDashboardSummary(period: string = "30") {
    return this.makeRequest(`/analytics/summary?period=${period}`);
  }

  // Reports endpoints
  async getReports(page: number = 1, limit: number = 10) {
    return this.makeRequest(`/reports?page=${page}&limit=${limit}`);
  }

  async getReport(id: string) {
    return this.makeRequest(`/reports/${id}`);
  }

  // Orders endpoints
  async getOrders(
    filters: {
      startDate?: Date;
      endDate?: Date;
      status?: string;
      region?: string;
    } = {}
  ) {
    const params = new URLSearchParams();

    if (filters.startDate)
      params.append("startDate", filters.startDate.toISOString());
    if (filters.endDate)
      params.append("endDate", filters.endDate.toISOString());
    if (filters.status) params.append("status", filters.status);
    if (filters.region) params.append("region", filters.region);

    return this.makeRequest(`/orders?${params}`);
  }

  async getOrdersSummary() {
    return this.makeRequest("/orders/summary");
  }

  // Customers endpoints
  async getCustomers() {
    return this.makeRequest("/customers");
  }

  // Products endpoints
  async getProducts() {
    return this.makeRequest("/products");
  }

  // Health check
  async healthCheck() {
    return this.makeRequest("/health");
  }
}

export const apiService = new ApiService();
