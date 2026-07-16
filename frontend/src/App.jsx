import { RouterProvider } from 'react-router'
import { router } from './app.routes'
import { ToastProvider } from './components/toastContext/toast.context'

const App = () => {
  return (
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>
  )
}

export default App