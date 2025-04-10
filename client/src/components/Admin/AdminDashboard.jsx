import {
  Calendar,
  Users,
  Globe,
  DollarSign,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const monthlyData = [
  { name: "Jan", bookings: 400, revenue: 12000 },
  { name: "Feb", bookings: 300, revenue: 9000 },
  { name: "Mar", bookings: 600, revenue: 18000 },
  { name: "Apr", bookings: 800, revenue: 24000 },
  { name: "May", bookings: 700, revenue: 21000 },
  { name: "Jun", bookings: 900, revenue: 27000 },
];

const popularDestinations = [
  { name: "Paris", value: 400, color: "#4F46E5" },
  { name: "Tokyo", value: 300, color: "#06B6D4" },
  { name: "New York", value: 300, color: "#8B5CF6" },
  { name: "London", value: 200, color: "#10B981" },
];

const recentBookings = [
  {
    id: 1,
    customer: "John Doe",
    destination: "Paris",
    date: "2024-03-20",
    amount: "$1,200",
  },
  {
    id: 2,
    customer: "Jane Smith",
    destination: "Tokyo",
    date: "2024-03-22",
    amount: "$1,500",
  },
  {
    id: 3,
    customer: "Mike Johnson",
    destination: "New York",
    date: "2024-03-25",
    amount: "$1,000",
  },
  {
    id: 4,
    customer: "Sarah Wilson",
    destination: "London",
    date: "2024-03-26",
    amount: "$1,300",
  },
];

const AdminDashboard = () => {
  return (
    <div className="p-6 bg-gray-50">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatsCard
          title="Total Bookings"
          value="1,234"
          change="+12.5%"
          isPositive={true}
          icon={Calendar}
          color="bg-blue-500"
        />
        <StatsCard
          title="Total Revenue"
          value="$123,456"
          change="+8.2%"
          isPositive={true}
          icon={DollarSign}
          color="bg-green-500"
        />
        <StatsCard
          title="Active Customers"
          value="5,678"
          change="-2.4%"
          isPositive={false}
          icon={Users}
          color="bg-purple-500"
        />
        <StatsCard
          title="Available Destinations"
          value="45"
          change="+5.3%"
          isPositive={true}
          icon={Globe}
          color="bg-yellow-500"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Revenue Overview
            </h2>
            <Select defaultValue="6months">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6months">Last 6 months</SelectItem>
                <SelectItem value="1year">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#6366F1"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bookings Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Booking Trends
            </h2>
            <Select defaultValue="6months">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6months">Last 6 months</SelectItem>
                <SelectItem value="1year">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Bar dataKey="bookings" fill="#6366F1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Destinations */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Popular Destinations
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={popularDestinations}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {popularDestinations.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4">
              {popularDestinations.map((destination, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className={`w-3 h-3 rounded-full mr-2`}
                    style={{ backgroundColor: destination.color }}
                  />
                  <span className="text-sm text-gray-600">
                    {destination.name}
                  </span>
                  <span className="ml-auto text-sm font-medium">
                    {destination.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Recent Expense
            </h2>
            <button className="text-sm text-indigo-600 hover:text-indigo-800">
              View All
            </button>
          </div>
          <div className="overflow-hidden">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Destination
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {booking.customer}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {booking.destination}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {booking.date}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {booking.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatsCard = ({ title, value, change, isPositive, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        <div className="flex items-center mt-2">
          {isPositive ? (
            <ArrowUp className="w-4 h-4 text-green-500" />
          ) : (
            <ArrowDown className="w-4 h-4 text-red-500" />
          )}
          <span
            className={`text-sm ml-1 ${
              isPositive ? "text-green-500" : "text-red-500"
            }`}
          >
            {change}
          </span>
          <span className="text-sm text-gray-500 ml-2">vs last month</span>
        </div>
      </div>
      <div className={`${color} p-3 rounded-full`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
    </div>
  </div>
);

export default AdminDashboard;
