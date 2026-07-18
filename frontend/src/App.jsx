import { RouterProvider } from 'react-router'
import { router } from './app.routes'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { getCurrentUser } from '../../backend/gateway/src/controller/user.controller'
import { setUser } from './redux/features/userSlice'


const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    async function fetchCurrentUser() {
      const data = await getCurrentUser();
      dispatch(setUser(data.user))
    } 
    fetchCurrentUser()
  }, [])
  return (
    <RouterProvider router={router} />
  )
}

export default App