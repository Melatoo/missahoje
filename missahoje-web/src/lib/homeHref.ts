export function homeHref(params: URLSearchParams): string {
  const query = params.toString();
  return query ? `/?${query}` : '/';
}
