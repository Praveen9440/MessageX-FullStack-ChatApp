import { useChatStore } from "../store/useChatStore";
import { useEffect, useState } from "react";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
const Sidebar = () => {
  const { users, isLoadingUsers, selectedUser, setSelectedUser, getUsers } =
    useChatStore();
  const { onlineUsers } = useAuthStore();

  const [showOnlineUsersOnly, setShowOnlineUsersOnly] = useState(false);
  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = showOnlineUsersOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;
  if (isLoadingUsers) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
        {/* Skeleton Contacts */}

        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineUsersOnly}
              onChange={(e) => setShowOnlineUsersOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show Online Users Only</span>
          </label>
          <span className="text-sx tesx-zinc-500">
            ({onlineUsers.length - 1} online)
          </span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => {
              setSelectedUser(user);
            }}
            className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors${
              selectedUser?._id === user._id
                ? "bg-base-300 ring-1 ring-base-300"
                : ""
            } `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic}
                alt={user.name}
                className="size-12 rounded-full object-cover"
              />
              {onlineUsers.includes(user._id) && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
              )}
            </div>
            {/* User info - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate ">{user.fullName}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}
        {filteredUsers.length === 0 && (
          <div className="flex justify-center items-center h-full">
            <span className="text-sm text-center py-10 text-zinc-400">
              No Online Users!
            </span>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
