// This is a sandbox to test isolated components
// Add your components examples prefixed with an `false &&`
// and activate them by turning the false into true.
import React from 'react'

// Lazy loading to avoid adding the examples to the application payload.
// You can use the boolean behind each component to enable and disable them.

const examples = [
  true && React.lazy(() => import('./Loading')),
  false && React.lazy(() => import('./SnackbarMessages.example')),
  false && React.lazy(() => import('./TableEditor.example')),
]

const renderLoader = () => <h1>Loading...</h1>

export default function TestPage() {
  return (
    <>
      {examples.map(
        (Example, i) =>
          Example && (
            <React.Suspense key={i} fallback={renderLoader()}>
              <Example />
            </React.Suspense>
          ),
      )}
    </>
  )
}
