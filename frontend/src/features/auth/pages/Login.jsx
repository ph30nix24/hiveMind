import Header from '../components/Header'
import LoginForm from '../components/LoginForm'
import LoginLeftColumn from '../components/LoginLeftColumn'
import { NeuralCanvas } from '../components/NeuralCanvas'
const Login = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans antialiased">
      <NeuralCanvas />
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-48 -left-48 w-175 h-175 rounded-full bg-radial from-[#3c5aff1c] from-0% to-transparent to-65%" />
        <div className="absolute -bottom-48 -right-48 size-175 rounded-full bg-radial from-[#8c46f01a] from-0% to-transparent to-65%" />
      </div>
      <Header mode="login" />
      <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center pt-24 pb-12 px-6 lg:px-12 gap-12 lg:gap-24 relative z-10">
        <LoginLeftColumn />
        <LoginForm />
      </main>
    </div>
  )
}

export default Login