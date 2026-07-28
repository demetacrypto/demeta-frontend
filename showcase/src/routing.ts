const configuredBase = import.meta.env.BASE_URL.replace(/\/$/, "");

export const BRAIN_RESEARCH_ROUTE = "/brain-research";

export function currentRoute() {
  const pathname = window.location.pathname.replace(/\/$/, "") || "/";
  if (pathname === BRAIN_RESEARCH_ROUTE || pathname.startsWith(`${BRAIN_RESEARCH_ROUTE}/`)) return BRAIN_RESEARCH_ROUTE;
  if (!configuredBase) return pathname;
  const withoutBase = pathname.startsWith(configuredBase) ? pathname.slice(configuredBase.length) : pathname;
  return withoutBase.replace(/\/$/, "") || "/";
}

export function routeHref(route: string) {
  if (route === "/") return "/";
  if (route === BRAIN_RESEARCH_ROUTE) return `${BRAIN_RESEARCH_ROUTE}/`;
  return `${configuredBase}${route}`;
}
