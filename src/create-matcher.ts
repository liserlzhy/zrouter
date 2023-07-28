import { RawLocation, Route, RouteConfig, RouteRecord } from './types'
import ZRouter from './index'
import { createRouteMap } from './create-route-map'

export interface Matcher {
  match: (raw: RawLocation, current?: Route, redirectedFrom?: Location) => Route
  addRoutes: (routes: Array<RouteConfig>) => void
  addRoute: (
    parentNameOrRoute: string | RouteConfig,
    route?: RouteConfig
  ) => void
  getRoutes: () => Array<RouteRecord>
}

export function createMatcher(
  routes: Array<RouteConfig>,
  router: ZRouter
): Matcher {
  const { pathList, pathMap, nameMap } = createRouteMap(routes)
}
