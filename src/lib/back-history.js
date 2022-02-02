// tracks history for the sake of the back button. stores it in localStorage
// so it works even after a page refresh

export const get = () => {
  return JSON.parse(localStorage.backHistory || '[]')
}

const set = (history) => {
  localStorage.backHistory = JSON.stringify(history)
}

export const push = (path) => {
  // if we're on "/", there should be no back history. clear it in case
  // something odd happened and there's history left
  if (path === '/') {
    clear()

    return
  }

  const history = get()

  history.push(path)

  set(history)
}

export const pop = () => {
  const history = get()

  // the last one is the current path, so remove it
  history.pop()
  // the new last one is the "back path", but remove it because once
  // we navigate to it, it will get added again to the back history
  const last = history.pop()

  set(history)

  // "/" never gets saved, so that's where we're going if there's nothing left
  // it's also the fallback if you visit a deeper page directly without
  // visiting the previous page first
  return last || '/'
}

export const clear = () => {
  set([])
}
