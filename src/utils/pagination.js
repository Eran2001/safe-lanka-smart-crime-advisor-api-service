export const parsePagination = (query) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const validPageSizes = [10, 25, 50, 100];
  let pageSize = parseInt(query.pageSize, 10) || 25;
  
  if (!validPageSizes.includes(pageSize)) {
    pageSize = 25;
  }
  
  const offset = (page - 1) * pageSize;
  
  return { page, pageSize, offset };
};

export const buildPaginatedResponse = (data, total, page, pageSize) => {
  return {
    data,
    meta: {
      page,
      pageSize,
      total
    }
  };
};

export const parseSort = (sortParam, allowedFields) => {
  if (!sortParam) return null;
  
  const [field, order] = sortParam.split(':');
  
  if (!allowedFields.includes(field)) {
    return null;
  }
  
  const direction = order === 'desc' ? 'desc' : 'asc';
  
  return { field, direction };
};