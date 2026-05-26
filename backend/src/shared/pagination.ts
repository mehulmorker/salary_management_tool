export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Parse page and limit from query params, with safe defaults.
 */
export function parsePagination(query: {
  page?: unknown;
  limit?: unknown;
}): PaginationParams {
  const page = Math.max(1, parseInt(String(query.page ?? '1'), 10) || 1);
  const limit = Math.min(
    200,
    Math.max(1, parseInt(String(query.limit ?? '50'), 10) || 50)
  );
  return { page, limit };
}

/**
 * Build the skip/take values for Prisma from page + limit.
 */
export function toSkipTake(params: PaginationParams): {
  skip: number;
  take: number;
} {
  return {
    skip: (params.page - 1) * params.limit,
    take: params.limit
  };
}

/**
 * Build the pagination meta object for API responses.
 */
export function buildMeta(
  total: number,
  params: PaginationParams
): PaginationMeta {
  return {
    total,
    page: params.page,
    limit: params.limit,
    totalPages: Math.ceil(total / params.limit)
  };
}
