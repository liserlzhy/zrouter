import pathToRegexp, { compile } from 'path-to-regexp'

export type RawLocation = string
export type MType<T> = T | null | undefined
export type RedirectOption = RawLocation | ((to: Route) => RawLocation)
export interface RouteRegExp extends RegExp {}
export interface RouteRecord {
  path: string
  alias: Array<string>
  regex: RouteRegExp
  components: Record<string, any>
  instances: Record<string, any>
  enteredCbs: Record<string, Array<Function>>
  name: MType<string>
  parent: MType<RouteRecord>
  redirect: MType<RedirectOption>
  matchAs: MType<string>
  beforeEnter: MType<NavigationGuard>
  meta: any
  props:
    | boolean
    | object
    | Function
    | Record<string, boolean | object | Function>
}

export interface Route {
  path: string
  name?: string
  hash: string
  query: Record<string, string>
  params: Record<string, string>
  fullPath: string
  matched: Array<RouteRecord>
  redirectedFrom?: string
  meta?: any
}
export interface NavigationGuard {
  to: Route
  from: Route
  next: (to?: NavigationGuard | false | Function | void) => void
}

export interface PathToRegexpOptions {
  sensitive?: boolean
  strict?: boolean
  end?: boolean
}

export interface RouteConfig {
  path: string
  name?: string
  component?: any
  components?: Record<string, any>
  redirect?: RedirectOption
  alias?: string | Array<string>
  children?: Array<RouteConfig>
  beforeEnter?: NavigationGuard
  meta?: any
  props?: boolean | object | Function
  caseSensitive?: boolean
  pathToRegexpOptions?: PathToRegexpOptions
}

export interface RouterOptions {
  routes?: Array<RouteConfig>
  mode?: string
  fallback?: boolean
  base?: string
  linkActiveClass?: string
  linkExactActiveClass?: string
  parseQuery?: (query: string) => string
  stringifyQuery?: (query: string) => string
}

// declare module 'path-to-regexp' {
//   export default (path: string, keys?: Array<{name: string}>, options?: PathToRegexpOptions) => RouteRegExp;
//   // export const compile: (path: string) => (params: object) => string
// }
