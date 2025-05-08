import { ArrowUp, ArrowDown } from "lucide-react";

const AdminDashboard = () => {
  return (
    <div className="p-6 mt-1 bg-gray-50">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatsCard
          // title="Total Bookings"
          value="DATA"

          // change="+12.5%"
          // isPositive={true}
          // icon={Calendar}
          // color="bg-blue-500"
        />
        <StatsCard
          // title="Total Revenue"
          value="DATA"

          // change="+8.2%"
          // isPositive={true}
          // icon={DollarSign}
          // color="bg-green-500"
        />
        <StatsCard
          // title="Active Customers"
          value="DATA"

          // change="-2.4%"
          // isPositive={false}
          // icon={Users}
          // color="bg-purple-500"
        />
        <StatsCard
          // title="Available Destinations"
          value="DATA"
          // change="+5.3%"
          // isPositive={true}
          // icon={Globe}
          // color="bg-yellow-500"
        />
      </div>
    </div>
  );
};

const StatsCard = ({ title, value, change, isPositive, color }) => (
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
        {/* <Icon className="h-6 w-6 text-white" /> */}
      </div>
    </div>
  </div>
);

export default AdminDashboard;
