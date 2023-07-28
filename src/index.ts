import { RouterOptions } from './types'
import { createMatcher, Matcher } from './create-matcher'

export default class ZRouter {
  private beforeHooks: Array<any> = []
  private matcher: Matcher

  constructor(private options: RouterOptions = {}) {
    this.matcher = createMatcher(options.routes || [], this)
  }
}
