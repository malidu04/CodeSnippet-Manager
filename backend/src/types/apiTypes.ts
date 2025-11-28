export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
  timestamp: string;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNext: boolean;
    hasPrev: boolean;
    nextPage: number | null;
    prevPage: number | null;
  };
}

export interface ErrorResponse {
  success: false;
  message: string;
  errors?: string[];
  timestamp: string;
  stack?: string;
}

export interface HealthCheckResponse {
  status: string;
  timestamp: string;
  uptime: number;
  database: string;
  memory: NodeJS.MemoryUsage;
  environment: string;
}