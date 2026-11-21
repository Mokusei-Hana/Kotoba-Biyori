import { useCallback, useEffect, useState } from 'react'

export type AppRoute =
  | 'dashboard'
  | 'dialogues'
  | 'flashcards'
  | 'grammar'
  | 'dictionary'
  | 'mistakes'
  | 'kana'

const VALID_ROUTES: AppRoute[] = [
  'dashboard',
  'dialogues',
  'flashcards',
  'grammar',
  'dictionary',
  'mistakes',
  'kana',
]

function parseHash(): { route: AppRoute; param?: string } {
  const raw = window.location.hash.replace(/^#\/?/, '')
  const [first, second] = raw.split('/')
  if (VALID_ROUTES.includes(first as AppRoute)) {
    return { route: first as AppRoute, param: second }
  }
  return { route: 'dashboard' }
}

export function useHashRoute() {
  const [location, setLocation] = useState<{ route: AppRoute; param?: string }>(() => parseHash())

  useEffect(() => {
    const onHashChange = () => setLocation(parseHash())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const navigate = useCallback((route: AppRoute, param?: string) => {
    const target = param ? `#/${route}/${param}` : `#/${route}`
    if (window.location.hash !== target) {
      window.location.hash = target
    } else {
      setLocation({ route, param })
    }
    window.scrollTo(0, 0)
  }, [])

  return {
    route: location.route,
    param: location.param,
    navigate,
  }
}
