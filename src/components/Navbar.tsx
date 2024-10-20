import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between">
        <div className="text-white text-lg font-bold">My App</div>
        <div className="space-x-4">
          <Link href="/" className="text-gray-300 hover:text-white">
            Home
          </Link>
          <Link href="/products" className="text-gray-300 hover:text-white">
            Products
          </Link>
          <Link href="/new" className="text-gray-300 hover:text-white">
            New
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
