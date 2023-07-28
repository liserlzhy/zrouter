import {
  PathToRegexpOptions,
  RouteConfig,
  RouteRecord,
  RouteRegExp,
} from './types'
import Regexp from 'path-to-regexp'
import { cleanPath } from './util/path'
export interface RouteMap {
  pathList: Array<string>
  pathMap: Record<string, RouteRecord>
  nameMap: Record<string, RouteRecord>
}

export function createRouteMap(
  routes: Array<RouteConfig>,
  oldPathList?: Array<string>,
  oldPathMap?: Record<string, RouteRecord>,
  oldNameMap?: Record<string, RouteRecord>,
  parentRoute?: RouteRecord
): RouteMap {
  const pathList: Array<string> = oldPathList || []
  const pathMap: Record<string, RouteRecord> = oldPathMap || Object.create(null)
  const nameMap: Record<string, RouteRecord> = oldNameMap || Object.create(null)

  routes.forEach(route => {
    addRouteRecord(pathList, pathMap, nameMap, route, parentRoute)
  })

  // ensure wildcard routes are always at the end
  for (let i = 0, l = pathList.length; i < l; i++) {
    if (pathList[i] === '*') {
      pathList.push(pathList.splice(i, 1)[0])
      l--
      i--
    }
  }

  return {
    pathList,
    pathMap,
    nameMap,
  }
}

function addRouteRecord(
  pathList: Array<string>,
  pathMap: Record<string, RouteRecord>,
  nameMap: Record<string, RouteRecord>,
  route: RouteConfig,
  parent?: RouteRecord,
  matchAs?: string
) {
  const { path, name } = route
  const pathToRegexpOption: PathToRegexpOptions =
    route.pathToRegexpOptions || {}
  const normalizedPath = normalizePath(path, parent, pathToRegexpOption.strict)

  if (typeof route.caseSensitive === 'boolean') {
    pathToRegexpOption.sensitive = route.caseSensitive
  }

  const record: RouteRecord = {
    path: normalizedPath,
    regex: compileRouteRegex(normalizedPath, pathToRegexpOption),
    components: route.components || { default: route.component },
    alias: route.alias
      ? typeof route.alias === 'string'
        ? [route.alias]
        : route.alias
      : [],
    instances: {},
    enteredCbs: {},
    name,
    parent,
    matchAs,
    redirect: route.redirect,
    beforeEnter: route.beforeEnter,
    meta: route.meta || {},
    props:
      route.props === null || route.props === undefined
        ? {}
        : route.components
        ? route.props
        : { default: route.props },
  }

  if (route.children) {
    route.children.forEach(child => {
      const childMatchAs = matchAs
        ? cleanPath(`${matchAs}/${child.path}`)
        : undefined
      addRouteRecord(pathList, pathMap, nameMap, child, record, childMatchAs)
    })
  }

  if (!pathMap[record.path]) {
    pathList.push(record.path)
    pathMap[record.path] = record
  }

  if (route.alias !== undefined) {
    const aliases = Array.isArray(route.alias) ? route.alias : [route.alias]
    for (let i = 0; i < aliases.length; ++i) {
      const alias = aliases[i]
      const aliasRoute = {
        path: alias,
        children: route.children,
      }
      addRouteRecord(
        pathList,
        pathMap,
        nameMap,
        aliasRoute,
        parent,
        record.path || '/' // matchAs
      )
    }
  }

  if (name) {
    if (!nameMap[name]) {
      nameMap[name] = record
    }
  }
}

function compileRouteRegex(
  path: string,
  pathToRegexpOptions: PathToRegexpOptions
): RouteRegExp {
  return Regexp(path, [], pathToRegexpOptions)
}

function normalizePath(
  path: string,
  parent?: RouteRecord,
  strict?: boolean
): string {
  if (!strict) path = path.replace(/\/$/, '')
  if (path[0] === '/') return path
  if (parent === null || parent === undefined) return path
  return cleanPath(`${parent.path}/${path}`)
}
