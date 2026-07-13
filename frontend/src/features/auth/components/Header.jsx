import { Link } from 'react-router'
const Header = ({ mode = 'signup' }) => (
  <header className="absolute top-0 left-0 w-full z-50 flex justify-between items-center py-6 px-5 md:px-30 lg:px-45">
    <Link to="/" className="flex items-center gap-2 no-underline" aria-label="Hivemind AI Home">
      <img src="../../../../hiveLogo.png" className="size-7" alt="" />
      <span className="text-xl font-semibold tracking-tight text-white flex items-baseline gap-1 font-heading">
        hivemind
        <span className="text-xs font-bold text-primary">AI</span>
      </span>
    </Link>

    <nav className="text-xs md:text-sm font-body text-text-muted">
      {mode === 'signup' ? (
        <>
          Already have an account?{' '}
          <Link to="/auth/login" className="text-primary font-medium hover:text-white transition-colors no-underline">
            Sign in
          </Link>
        </>
      ) : (
        <>
          Don&apos;t have an account?{' '}
          <Link to="/auth/signup" className="text-primary font-medium hover:text-white transition-colors no-underline">
            Sign up
          </Link>
        </>
      )}
    </nav>
  </header>
);


export default Header;
