import { RouterProvider } from 'react-router'
import { router } from './app.routes'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setUser } from './redux/features/userSlice'
import { getCurrentUserApi } from './apis/user.apis'


const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    async function fetchCurrentUser() {
      const data = await getCurrentUserApi();
      dispatch(setUser(data.user))
    } 
    fetchCurrentUser()
  }, [])

  return (
    <RouterProvider router={router} />
  )
}

export default App