
const Header = () => (
  <header className="absolute top-0 left-0 w-full z-50 flex justify-between items-center py-6 px-8">
    <a href="/" className="flex items-center gap-2 no-underline" aria-label="Hivemind AI Home">
      <img src="../../../../hiveLogo.png" className="size-7" alt="" />
      <span className="text-xl font-semibold text-white flex items-baseline gap-1 font-heading">
        hivemind
        <span className="text-xs font-bold text-primary">AI</span>
      </span>
    </a>
    <nav className="text-[10px] md:text-sm text-text-muted font-body">
      Already have an account?{' '}
      <a href="/signin" className="text-primary font-medium hover:text-white transition-colors no-underline">
        Sign in
      </a>
    </nav>
  </header>
);

export default Header;
