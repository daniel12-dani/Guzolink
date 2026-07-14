function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white px-4 py-8 text-sm text-slate-600 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 Guzolink. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="/products" className="hover:text-amber-600">
            Products
          </a>
          <a href="/login" className="hover:text-amber-600">
            Login
          </a>
          <a href="/cart" className="hover:text-amber-600">
            Cart
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
