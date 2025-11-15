
import { Link } from 'react-router-dom';

const USFlagIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 72 72" className="rounded-full">
    <path fill="#eee" d="M0 0h72v72H0z"/>
    <path fill="#d22f27" d="M0 6v6h72V6Zm0 12v6h72v-6Zm0 12v6h72v-6Zm0 12v6h72v-6Zm0 12v6h72v-6Z"/>
    <path fill="#192f5d" d="M0 0h36v36H0z"/>
    <g fill="#fff"><path d="M7.2 4.8 6 6.9l-1.2-2.1L3.6 6l1.2 2.1L6 10.2l1.2-2.1 1.2-2.1-1.2-2.1z m9 0L15 6.9l-1.2-2.1-1.2 2.1 1.2 2.1 1.2 2.1 1.2-2.1 1.2-2.1-1.2-2.1z m9 0L24 6.9l-1.2-2.1L21.6 6l1.2 2.1L24 10.2l1.2-2.1 1.2-2.1-1.2-2.1z"/><path d="M11.7 10.8 10.5 12.9l-1.2-2.1L8.1 12l1.2 2.1 1.2 2.1 1.2-2.1 1.2-2.1-1.2-2.1z m9 0L19.5 12.9l-1.2-2.1-1.2 2.1 1.2 2.1 1.2 2.1 1.2-2.1 1.2-2.1-1.2-2.1z m9 0L28.5 12.9l-1.2-2.1-1.2 2.1 1.2 2.1 1.2 2.1 1.2-2.1 1.2-2.1-1.2-2.1z"/><path d="M7.2 16.8 6 18.9l-1.2-2.1L3.6 18l1.2 2.1L6 22.2l1.2-2.1 1.2-2.1-1.2-2.1z m9 0L15 18.9l-1.2-2.1-1.2 2.1 1.2 2.1 1.2 2.1 1.2-2.1 1.2-2.1-1.2-2.1z m9 0L24 18.9l-1.2-2.1L21.6 18l1.2 2.1L24 22.2l1.2-2.1 1.2-2.1-1.2-2.1z"/><path d="M11.7 22.8 10.5 24.9l-1.2-2.1L8.1 24l1.2 2.1 1.2 2.1 1.2-2.1 1.2-2.1-1.2-2.1z m9 0L19.5 24.9l-1.2-2.1-1.2 2.1 1.2 2.1 1.2 2.1 1.2-2.1 1.2-2.1-1.2-2.1z m9 0L28.5 24.9l-1.2-2.1-1.2 2.1 1.2 2.1 1.2 2.1 1.2-2.1 1.2-2.1-1.2-2.1z"/><path d="M7.2 28.8 6 30.9l-1.2-2.1L3.6 30l1.2 2.1L6 34.2l1.2-2.1 1.2-2.1-1.2-2.1z m9 0L15 30.9l-1.2-2.1-1.2 2.1 1.2 2.1 1.2 2.1 1.2-2.1 1.2-2.1-1.2-2.1z m9 0L24 30.9l-1.2-2.1L21.6 30l1.2 2.1L24 34.2l1.2-2.1 1.2-2.1-1.2-2.1z"/></g>
  </svg>
);

const IndiaFlagIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 72 72" className="rounded-full">
    <path fill="#eee" d="M0 0h72v72H0z"/><path fill="#f15b25" d="M0 0h72v24H0z"/><path fill="#128807" d="M0 48h72v24H0z"/><circle cx="36" cy="36" r="8" fill="none" stroke="#192f5d" strokeWidth="2"/><g stroke="#192f5d" strokeWidth="1.5" strokeLinecap="round">{Array.from({length: 24}).map((_, i) => (<path key={i} d={`m36 36 0-8`} transform={`rotate(${i * 15} 36 36)`}/>))}</g>
  </svg>
);

const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-bold text-blue-600">
                GlobalRemit
            </Link>
            <div className="hidden md:flex items-center space-x-2">
              <button className="px-4 py-2 text-sm font-semibold text-gray-800 bg-gray-100 rounded-full">Personal</button>
              <button className="px-4 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-100 rounded-full">Business</button>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-sm font-semibold">
              <button className="flex items-center space-x-1 p-2 hover:bg-gray-100 rounded-md">
                <USFlagIcon />
                <span>To:</span>
                <IndiaFlagIcon />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-md">English</button>
              <a href="#" className="p-2 hover:bg-gray-100 rounded-md">Help</a>
            </div>
             <Link to="/signup" className="px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-100 rounded-md">
              Sign up
            </Link>
            <Link to="/login" className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">
              Log In
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;