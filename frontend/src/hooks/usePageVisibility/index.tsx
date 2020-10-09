import React from 'react'

const getBrowserVisibilityProp = (): string => {
  if (typeof (document as any).msHidden !== 'undefined') {
    return 'msvisibilitychange'
  } else if (typeof (document as any).webkitHidden !== 'undefined') {
    return 'webkitvisibilitychange'
  } else {
    return 'visibilitychange'
  }
}

const getBrowserDocumentHiddenProp = (): string => {
  if (typeof (document as any).msHidden !== 'undefined') {
    return 'msHidden'
  } else if (typeof (document as any).webkitHidden !== 'undefined') {
    return 'webkitHidden'
  } else {
    return 'hidden'
  }
}

const getIsDocumentHidden = (): boolean => {
  return !(document as any)[getBrowserDocumentHiddenProp()]
}

export default function usePageVisibility(): boolean {
  const [isVisible, setIsVisible] = React.useState(getIsDocumentHidden())
  /* istanbul ignore next */
  const onVisibilityChange = () => setIsVisible(getIsDocumentHidden())

  React.useEffect(() => {
    const visibilityChange = getBrowserVisibilityProp()

    document.addEventListener(visibilityChange, onVisibilityChange, false)

    return () => {
      document.removeEventListener(visibilityChange, onVisibilityChange)
    }
  })

  return isVisible
}
