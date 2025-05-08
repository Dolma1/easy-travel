import { useState, useMemo } from "react";
import { useGetSettlementsQuery } from "@/app/slices/adminApiSlice";
import {
  CircleDollarSign,
  Calendar,
  Search,
  Users,
  Filter,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#10B981", "#F59E0B", "#3B82F6", "#EC4899"];

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
};

const formatAmount = (amount, currency) => {
  return `${amount.toLocaleString()} ${currency}`;
};

const PaymentMethodBadge = ({ method }) => {
  const getColor = () => {
    switch (method) {
      case "cash":
        return "bg-green-100 text-green-800";
      case "khalti":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${getColor()}`}
    >
      {method.charAt(0).toUpperCase() + method.slice(1)}
    </span>
  );
};

const StatusBadge = ({ status }) => {
  const getVariant = () => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${getVariant()}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const SettlementsTable = ({ settlements }) => {
  return (
    <div className="rounded-md border overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-slate-50">
            <th className="h-12 px-4 text-left align-middle font-medium text-slate-500">
              Expense Description
            </th>
            <th className="h-12 px-4 text-left align-middle font-medium text-slate-500">
              Payer → Receiver
            </th>
            <th className="h-12 px-4 text-left align-middle font-medium text-slate-500">
              Amount
            </th>
            <th className="h-12 px-4 text-left align-middle font-medium text-slate-500">
              Method
            </th>
            <th className="h-12 px-4 text-left align-middle font-medium text-slate-500">
              Status
            </th>
            <th className="h-12 px-4 text-left align-middle font-medium text-slate-500">
              Date
            </th>
          </tr>
        </thead>
        <tbody>
          {settlements.map((settlement) => (
            <tr key={settlement._id} className="border-b hover:bg-slate-50">
              <td className="p-4 align-middle font-medium">
                {settlement.expense.description}
              </td>
              <td className="p-4 align-middle text-sm">
                <div className="flex flex-col">
                  <span>{settlement.payer.name}</span>
                  <span className="text-slate-500 text-xs">
                    → {settlement.receiver.name}
                  </span>
                </div>
              </td>
              <td className="p-4 align-middle">
                {formatAmount(settlement.amount, settlement.currency)}
              </td>
              <td className="p-4 align-middle">
                <PaymentMethodBadge method={settlement.paymentMethod} />
              </td>
              <td className="p-4 align-middle">
                <StatusBadge status={settlement.status} />
              </td>
              <td className="p-4 align-middle text-xs">
                {formatDate(settlement.settledAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const SettlementAnalytics = ({ settlements }) => {
  // Calculate payment method distribution
  const paymentMethodData = useMemo(() => {
    const methods = {};
    settlements.forEach((settlement) => {
      methods[settlement.paymentMethod] =
        (methods[settlement.paymentMethod] || 0) + 1;
    });

    return Object.keys(methods).map((key) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: methods[key],
    }));
  }, [settlements]);

  // Calculate total amount settled
  const totalAmount = useMemo(() => {
    return settlements.reduce((sum, settlement) => sum + settlement.amount, 0);
  }, [settlements]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="rounded-lg border p-4 shadow-sm">
        <div className="pb-2">
          <h3 className="text-sm font-medium">Total Settlements</h3>
        </div>
        <div>
          <div className="flex items-center">
            <Users className="h-4 w-4 text-slate-500 mr-2" />
            <span className="text-2xl font-bold">{settlements.length}</span>
          </div>
        </div>
      </div>

      <div className="rounded-lg border p-4 shadow-sm">
        <div className="pb-2">
          <h3 className="text-sm font-medium">Total Amount</h3>
        </div>
        <div>
          <div className="flex items-center">
            <CircleDollarSign className="h-4 w-4 text-slate-500 mr-2" />
            <span className="text-2xl font-bold">
              {formatAmount(totalAmount, settlements[0]?.currency || "NPR")}
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-lg border p-4 shadow-sm">
        <div className="pb-2">
          <h3 className="text-sm font-medium">Payment Methods</h3>
        </div>
        <div className="h-36">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={paymentMethodData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={60}
                paddingAngle={5}
                dataKey="value"
                label={({ name }) => name}
              >
                {paymentMethodData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value} settlements`, "Count"]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const AdminAllSettlements = () => {
  const { data, isLoading, isError } = useGetSettlementsQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMethod, setFilterMethod] = useState("all");
  const [activeTab, setActiveTab] = useState("all");

  const filteredSettlements = useMemo(() => {
    if (!data?.settlements) return [];

    return data.settlements.filter((settlement) => {
      // Filter by payment method
      if (filterMethod !== "all" && settlement.paymentMethod !== filterMethod) {
        return false;
      }

      // Search by description, payer name, or receiver name
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          settlement.expense.description.toLowerCase().includes(searchLower) ||
          settlement.payer.name.toLowerCase().includes(searchLower) ||
          settlement.receiver.name.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  }, [data, searchTerm, filterMethod]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        Loading settlements...
      </div>
    );
  }

  if (isError) {
    return <div className="text-red-500">Error loading settlements</div>;
  }

  if (!data?.settlements || data.settlements.length === 0) {
    return <div className="text-center py-10">No settlements found</div>;
  }

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div className="flex flex-col">
        <h2 className="text-2xl font-bold tracking-tight">Settlements</h2>
        <p className="text-slate-500">
          Manage and track all financial settlements across the platform
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">


          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <input
                placeholder="Search settlements..."
                className="pl-8 pr-4 py-2 border rounded-md w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="relative">
              <select
                className="appearance-none pl-8 pr-8 py-2 border rounded-md w-40"
                value={filterMethod}
                onChange={(e) => setFilterMethod(e.target.value)}
              >
                <option value="all">All Methods</option>
                <option value="cash">Cash</option>
                <option value="khalti">Khalti</option>
              </select>
              <Filter className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            </div>
          </div>
        </div>


        <SettlementsTable settlements={filteredSettlements} />


      </div>
    </div>
  );
};

export default AdminAllSettlements;
