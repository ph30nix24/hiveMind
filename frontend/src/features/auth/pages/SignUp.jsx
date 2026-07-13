import Header from "../components/Header"
import LeftColumn from "../components/LeftColumn"
import SignUpForm from "../components/SignUpForm"

const SignUp = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans antialiased">
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center pt-24 pb-12 px-6 lg:px-12 gap-12 lg:gap-24 relative z-10">
        <LeftColumn />
        <SignUpForm />
      </main>
    </div>
  )
}

export default SignUp