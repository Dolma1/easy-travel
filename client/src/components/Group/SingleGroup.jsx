import { useState } from "react";
import {
  Calendar,
  Users,
  ArrowLeft,
  PieChart,
  Wallet,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  useGetTravelExpensesQuery,
  useGetSingleTravelGroupQuery,
} from "@/app/slices/travelGroupApiSlice";
import { useParams, useNavigate } from "react-router-dom";
import AddExpenses from "./AddExpenses";
import ShareCodeGenerator from "./ShareCodeGenerator";
import { useSelector } from "react-redux";
import GroupDetails from "./GroupDetails";

const StatusBadgeConfig = {
  pending: {
    icon: Clock,
    color: "bg-yellow-50 text-yellow-700 border-yellow-200",
    iconColor: "text-yellow-500",
  },
  settled: {
    icon: CheckCircle2,
    color: "bg-green-50 text-green-700 border-green-200",
    iconColor: "text-green-500",
  },
  disputed: {
    icon: AlertCircle,
    color: "bg-red-50 text-red-700 border-red-200",
    iconColor: "text-red-500",
  },
};

const StatusBadge = ({ status }) => {
  const config =
    StatusBadgeConfig[status.toLowerCase()] || StatusBadgeConfig.pending;
  const Icon = config.icon;

  return (
    <div
      className={`inline-flex mt-1 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border ${config.color}`}
    >
      <Icon className={`w-4 h-4  ${config.iconColor}`} />
      {status}
    </div>
  );
};

function SingleGroup() {
  const [activeTab, setActiveTab] = useState("activity");
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: expensesData, isLoading: expensesLoading } =
    useGetTravelExpensesQuery(id);
  const { data: groupData, refetch, isLoading: groupLoading } =
    useGetSingleTravelGroupQuery(id);

  const handleBack = () => navigate(-1);
  const userdata = useSelector((state) => state.auth?.user?._id);

  if (groupLoading || expensesLoading) return <div>Loading...</div>;

  const expenses = Array.isArray(expensesData?.expenses)
    ? expensesData.expenses
    : [];
  const reversedExpenses = [...expenses].reverse();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <h1 className="text-xl font-semibold text-gray-900">
            {groupData?.group?.name || "Travel Group"}
          </h1>
          <div className="flex gap-6">
            {userdata === groupData?.group?.creator?._id && (
              <ShareCodeGenerator groupId={id} />
            )}
            <GroupDetails isView={groupData} refetch={refetch} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab("activity")}
            className={`px-8 py-3 rounded-full font-medium ${
              activeTab === "activity"
                ? "bg-gray-200 text-gray-900"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            Activity
          </button>
          <button
            onClick={() => setActiveTab("summary")}
            className={`px-8 py-3 rounded-full font-medium ${
              activeTab === "summary"
                ? "bg-[#FE9935]/80 text-black"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            Your Summary
          </button>
        </div>

        {activeTab === "activity" ? (
          <div className="space-y-4">
            {reversedExpenses.length > 0 ? (
              reversedExpenses.map((expense) => (
                <div
                  key={expense._id}
                  className="bg-white rounded-xl p-6 border border-gray-100"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex justify-between mb-3">
                        <span className="text-lg font-semibold">
                          {expense.description}
                        </span>
                        <StatusBadge status={expense.status} />
                      </div>
                      <div className="grid grid-cols-3 gap-6">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4 text-indigo-500" />
                          {new Date(expense.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="w-4 h-4 text-green-500" />
                          Paid by: {expense.paidBy.name}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <PieChart className="w-4 h-4 text-orange-500 " />
                          {expense.category.charAt(0).toUpperCase() +
                            expense.category.slice(1)}
                        </div>
                      </div>
                    </div>
                    <div className="ml-6">
                      <p className="text-md font-bold flex gap-2 bg-green-100 text-green-700 p-1.5 rounded-2xl ">
                        <Wallet />
                        {expense.amount?.toFixed(2)}{" "}
                        {groupData?.group?.currency}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20">
                <div className="w-16 h-16 text-gray-400 mx-auto mb-4">
                  <Wallet className="w-full h-full" />
                </div>
                <p className="text-xl font-semibold text-gray-500">
                  No expenses recorded yet
                </p>
                <p className="text-gray-400 mt-2">
                  Add your first expense using the button below
                </p>
              </div>
            )}
            <AddExpenses />
          </div>
        ) : (
          <div className="bg-gradient-to-br from-[#2a44a3] to-[#1b07f0e1] rounded-2xl p-1">
            <div className="bg-white/[0.02] backdrop-blur-sm rounded-xl p-8">
              <div className="grid grid-cols-2 gap-8">
                {/* Total Expenses */}
                <div className="flex flex-col items-center p-6 rounded-lg bg-white/10 border border-white/20">
                  <Wallet className="w-6 h-6 mb-2 text-white/80" />
                  <h3 className="text-white/60 text-sm font-medium mb-2">
                    Total Expenses
                  </h3>
                  <div className="text-white">
                    <span className="text-3xl font-semibold">
                      {groupData.group.currency} {groupData.group.totalExpenses}
                    </span>
                  </div>
                </div>

                {/* Total Budget */}
                <div className="flex flex-col items-center p-6 rounded-lg bg-white/10 border border-white/20">
                  <PiggyBank className="w-6 h-6 mb-2 text-white/80" />
                  <h3 className="text-white/60 text-sm font-medium mb-2">
                    Total Budget
                  </h3>
                  <div className="text-white">
                    <span className="text-3xl font-semibold">
                      {groupData.group.currency} {groupData.group.budget}
                    </span>
                  </div>
                </div>

                {/* You Owe */}
                <div className="flex flex-col items-center p-6 rounded-lg bg-white/10 border border-white/20">
                  <ArrowUpRight className="w-6 h-6 mb-2 text-red-300" />
                  <h3 className="text-white/60 text-sm font-medium mb-2">
                    You Owe
                  </h3>
                  <div className="text-white">
                    <span className="text-3xl font-semibold">
                      {groupData.group.currency} 0
                    </span>
                  </div>
                </div>

                {/* People Owe You */}
                <div className="flex flex-col items-center p-6 rounded-lg bg-white/10 border border-white/20">
                  <ArrowDownRight className="w-6 h-6 mb-2 text-green-300" />
                  <h3 className="text-white/60 text-sm font-medium mb-2">
                    Owed to You
                  </h3>
                  <div className="text-white">
                    <span className="text-3xl font-semibold">
                      {groupData.group.currency} 16400
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Add Expense Button */}
    </div>
  );
}

export default SingleGroup;
