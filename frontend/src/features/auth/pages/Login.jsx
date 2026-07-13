import Header from '../components/Header'
import LoginForm from '../components/LoginForm'
import LoginLeftColumn from '../components/LoginLeftColumn'
const Login = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans antialiased">
      <Header mode="login" />
      <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center pt-24 pb-12 px-6 lg:px-12 gap-12 lg:gap-24 relative z-10">
        <LoginLeftColumn />
        <LoginForm />
      </main>
    </div>
  )
}

export default Login