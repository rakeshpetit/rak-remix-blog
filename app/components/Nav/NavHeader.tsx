import { Link } from "remix";

function NavHeader() {
  return (
    <Link
      className="text-xl font-bold text-yellow-800 dark:text-yellow-200 md:text-xl hover:text-gray-700 dark:hover:text-gray-300"
      title="Rakesh Arun"
      to="/"
    >
      Rakesh Arun
    </Link>
  );
}

export default NavHeader;
