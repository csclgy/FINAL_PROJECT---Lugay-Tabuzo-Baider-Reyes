import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Icons
import { 
  XIcon, 
  HomeIcon, 
  TicketIcon, 
  UserGroupIcon, 
  ChartBarIcon,
  PlusCircleIcon
} from '@heroicons/react/outline';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Tickets', href: '/tickets', icon: TicketIcon },
  { name: 'New Ticket', href: '/tickets/create', icon: PlusCircleIcon },
  { name: 'Reports', href: '/reports', icon: ChartBarIcon },
  { name: 'Teams', href: '/teams', icon: UserGroupIcon },
];

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user } = useAuth();

  return (
    <>
      {/* Mobile sidebar */}
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 flex z-40 md:hidden" onClose={setIsOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>
          
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-gray-800">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button
                    type="button"
                    className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </Transition.Child>
              
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div className="flex-shrink-0 flex items-center px-4">
                  <h1 className="text-xl font-bold text-white">Helpdesk App</h1>
                </div>
                <nav className="mt-5 px-2 space-y-1">
                  {navigation.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      className={({ isActive }) =>
                        `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                          isActive
                            ? 'bg-gray-900 text-white'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <item.icon
                            className={`mr-3 flex-shrink-0 h-6 w-6 ${
                              isActive ? 'text-blue-400' : 'text-gray-400 group-hover:text-gray-300'
                            }`}
                            aria-hidden="true"
                          />
                          {item.name}
                        </>
                      )}
                    </NavLink>
                  ))}
                </nav>
              </div>
              
              <div className="flex-shrink-0 flex bg-gray-700 p-4">
                <div className="flex-shrink-0 w-full group block">
                  <div className="flex items-center">
                    <div>
                      <div className="inline-block h-9 w-9 rounded-full bg-gray-800 text-white flex items-center justify-center">
                        {(user?.name || 'U').charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-white">{user?.name || 'User'}</p>
                      <p className="text-xs font-medium text-gray-300 group-hover:text-gray-200">
                        {user?.role || 'User'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
          
          <div className="flex-shrink-0 w-14" aria-hidden="true">
            {/* Force sidebar to shrink to fit close icon */}
          </div>
        </Dialog>
      </Transition.Root>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-gray-800">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-xl font-bold text-white">Helpdesk App</h1>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon
                        className={`mr-3 flex-shrink-0 h-6 w-6 ${
                          isActive ? 'text-blue-400' : 'text-gray-400 group-hover:text-gray-300'
                        }`}
                        aria-hidden="true"
                      />
                      {item.name}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>
          
          <div className="flex-shrink-0 flex bg-gray-700 p-4">
            <div className="flex-shrink-0 w-full group block">
              <div className="flex items-center">
                <div>
                  <div className="inline-block h-9 w-9 rounded-full bg-gray-800 text-white flex items-center justify-center">
                    {(user?.name || 'U').charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">{user?.name || 'User'}</p>
                  <p className="text-xs font-medium text-gray-300 group-hover:text-gray-200">
                    {user?.role || 'User'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;