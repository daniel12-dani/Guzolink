// src/pages/admin/AdminPage.jsx

import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Store,
  Package,
  BarChart3,
  Settings,
  Bell,
  Search,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../features/auth/auth.context.js";
import { useShops } from "../features/shop/shop.context.js";
import useProducts from "../features/products/hooks/useProducts.js";

export default function AdminPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState("dashboard");
  const allUsers = useAuth().getAllUsers();
  //   const allShops = useShops();
  //   const allProducts = useProducts();
  const stats = [
    {
      title: "Total Users",
      value: allUsers?.users?.length || "0",
      icon: <Users size={24} />,
    },
    {
      title: "Total Products",
      value: "0",
      icon: <Package size={24} />,
    },
    {
      title: "Total Shops",
      value: "0",
      icon: <Store size={24} />,
    },
    {
      title: "Monthly Revenue",
      value: "$0",
      icon: <BarChart3 size={24} />,
    },
  ];

  const menu = [
    {
      id: "dashboard",
      title: "Dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      id: "users",
      title: "Users",
      icon: <Users size={20} />,
    },
    {
      id: "products",
      title: "Products",
      icon: <Package size={20} />,
    },
    {
      id: "shops",
      title: "Shops",
      icon: <Store size={20} />,
    },
    {
      id: "analytics",
      title: "Analytics",
      icon: <BarChart3 size={20} />,
    },
    {
      id: "settings",
      title: "Settings",
      icon: <Settings size={20} />,
    },
  ];

  return (
    <div className="flex h-screen bg-slate-100">
      {/* Sidebar */}

      <aside
        className={`bg-slate-900 text-white transition-all duration-300 ${
          sidebarOpen ? "w-72" : "w-20"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          {sidebarOpen && <h1 className="text-xl font-bold">Admin Panel</h1>}

          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X /> : <Menu />}
          </button>
        </div>

        <nav className="mt-6">
          {menu.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 transition

                            ${
                              activePage === item.id
                                ? "bg-blue-600"
                                : "hover:bg-slate-800"
                            }
                            `}
            >
              {item.icon}

              {sidebarOpen && item.title}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main */}

      <main className="flex-1 overflow-auto">
        {/* Header */}

        <header className="bg-white shadow">
          <div className="flex justify-between items-center px-8 py-5">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-3 text-gray-400"
              />

              <input
                placeholder="Search..."
                className="pl-10 pr-4 py-2 rounded-lg border w-80"
              />
            </div>

            <div className="flex items-center gap-5">
              <Bell />

              <div className="flex items-center gap-3">
                <img
                  src="https://i.pravatar.cc/150"
                  alt=""
                  className="w-10 h-10 rounded-full"
                />

                <div>
                  <p className="font-semibold">Admin</p>

                  <p className="text-sm text-gray-500">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}

        <section className="p-8 space-y-8">
          <h2 className="text-3xl font-bold capitalize">{activePage}</h2>

          {/* Stats */}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {stats.map((card) => (
              <div key={card.title} className="bg-white rounded-xl shadow p-6">
                <div className="flex justify-between">
                  <div>
                    <p className="text-gray-500">{card.title}</p>

                    <h2 className="text-3xl font-bold mt-3">{card.value}</h2>
                  </div>

                  <div className="bg-blue-100 p-4 rounded-xl text-blue-600">
                    {card.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts */}

          <div className="grid xl:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow p-6 h-96">
              <h3 className="font-semibold mb-4">User Growth</h3>

              <div className="h-full flex items-center justify-center text-gray-400">
                Chart goes here
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6 h-96">
              <h3 className="font-semibold mb-4">Product Categories</h3>

              <div className="h-full flex items-center justify-center text-gray-400">
                Pie Chart goes here
              </div>
            </div>
          </div>

          {/* Recent Activity */}

          <div className="bg-white rounded-xl shadow">
            <div className="border-b p-5">
              <h3 className="font-semibold">Recent Activity</h3>
            </div>

            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  <th className="p-4">User</th>
                  <th className="p-4">Action</th>
                  <th className="p-4">Date</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td className="p-4">No Data</td>

                  <td className="p-4">-</td>

                  <td className="p-4">-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
