const configuredBase = import.meta.env.BASE_URL.replace(/\/$/, "");

export function currentRoute() {
  const pathname = window.location.pathname.replace(/\/$/, "") || "/";
  if (!configuredBase) return pathname;
  const withoutBase = pathname.startsWith(configuredBase)
    ? pathname.slice(configuredBase.length)
    : pathname;
  return withoutBase.replace(/\/$/, "") || "/";
}

export function routeHref(route: string) {
  if (route === "/") return configuredBase ? `${configuredBase}/` : "/";
  return `${configuredBase}${route}`;
}
