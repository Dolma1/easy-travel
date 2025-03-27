import { useState } from "react";
import {
  Calendar,
  Users,
  PieChart,
  Wallet,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Send,
  BanknoteIcon,
  Eye,
  CircleCheck,
} from "lucide-react";
import {
  useGetTravelExpensesQuery,
  useGetSingleTravelGroupQuery,
} from "@/app/slices/travelGroupApiSlice";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import AddExpenses from "./AddExpenses";
import ExpenseDetailsDialog from "./ExpenseDetailsDialog";
import {
  useGetExpenseSummaryQuery,
  useRequestMoneyMutation,
} from "../../app/slices/expenseApiSlice";
import { ScrollArea } from "../ui/scroll-area";
import { toast } from "react-toastify";
import GroupNav from "./GroupNav";
import { useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import { useEffect } from "react";

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
  const [activeSecondaryTab, setActiveSecondaryTab] = useState("received");
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [requestingExpenseId, setRequestingExpenseId] = useState(null);

  const {
    data: expensesData,
    isLoading: expensesLoading,
    refetch: expenseRefetch,
  } = useGetTravelExpensesQuery(id, {
    pollingInterval: 3000, // Refetch every 30 seconds
  });

  const {
    data: groupData,
    refetch: groupRefetch,
    isLoading: groupLoading,
  } = useGetSingleTravelGroupQuery(id, {
    pollingInterval: 3000,
  });

  const {
    data: summaryData,
    isLoading: summaryLoading,
    refetch: summaryRefetch,
  } = useGetExpenseSummaryQuery(id, {
    pollingInterval: 3000,
  });

  const [requestMoney, { isLoading: requestMoneyLoading }] =
    useRequestMoneyMutation();
  const userdata = useSelector((state) => state.auth?.user?._id);

  const handleSettleExpense = (expenseId) => {
    // Handle settle expense logic
    navigate(`/groups/settlement/${expenseId}`, {
      state: { groupId: id },
    });
    window.location.reload()
  };

  const handleRequestMoney = async (expenseId) => {
    try {
      setRequestingExpenseId(expenseId);
      const response = await requestMoney(expenseId).unwrap();
      toast.success("Email sent to all the debtors");
      if (response.success) {
        toast.success("Email sent to all the debtors");
      }
    } catch (error) {
      toast.error("Failed to send email");
      console.error("Error requesting money:", error);
    } finally {
      setRequestingExpenseId(null);
    }
  };

  const handleViewDetails = (expense) => {
    setSelectedExpense(expense);
    setIsDetailsOpen(true);
  };

  if (groupLoading || expensesLoading) return <div>Loading...</div>;

  const expenses = Array.isArray(expensesData?.expenses)
    ? expensesData.expenses
    : [];
  const reversedExpenses = [...expenses].reverse();

  return (
    <div className=" bg-gray-50">
      {/* Header */}
      <GroupNav id={id} />
      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-4 mb-6">
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
          <ScrollArea className="h-[calc(100vh-192px)]">
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
                          <span className="text-lg font-semibold capitalize">
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
                        {/* Action Buttons */}
                        <div className="mt-4 flex gap-3">
                          <button
                            onClick={() => handleViewDetails(expense)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>
                          {expense.status !== "settled" && (
                            <>
                              {expense.splitBetween.some(
                                (entry) =>
                                  String(entry.user._id) === String(userdata) &&
                                  entry.status !== "paid"
                              ) ? (
                                <>
                                  {expense.paidBy._id !== String(userdata) && (
                                    <button
                                      onClick={() =>
                                        handleSettleExpense(expense._id)
                                      }
                                      className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                                    >
                                      <Send className="w-4 h-4" />
                                      Settle Expense
                                    </button>
                                  )}
                                </>
                              ) : (
                                <>
                                  <Badge
                                    variant={"secondary"}
                                    className="capitalize  bg-green-100 text-green-700 shadow-sm hover:bg-green-100 rounded-xl "
                                  >
                                    <CircleCheck className="w-[18px] mr-1 text-green-500" />
                                    Already Settled
                                  </Badge>
                                </>
                              )}
                              {expense.paidBy._id === userdata && (
                                <button
                                  onClick={() =>
                                    handleRequestMoney(expense._id)
                                  }
                                  disabled={requestingExpenseId === expense._id}
                                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                                >
                                  {requestingExpenseId === expense._id ? (
                                    <>Requesting...</>
                                  ) : (
                                    <>
                                      <BanknoteIcon className="w-4 h-4" />
                                      Request Money
                                    </>
                                  )}
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                      <div className="ml-6">
                        <p className="text-md font-bold flex gap-2 bg-green-100 text-green-700 p-1.5 rounded-2xl ">
                          <Wallet />
                          {expense.amount?.toFixed(0)}{" "}
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
          </ScrollArea>
        ) : (
          <div>
            <div className="bg-gradient-to-r from-[#6a5af9] to-[#4941d3] rounded-2xl p-1 shadow-lg">
              <div className="bg-white/[0.02] backdrop-blur-sm rounded-xl p-3 ">
                <div className="grid grid-cols-4 gap-4">
                  {/* Total Expenses */}
                  <div className="flex flex-col items-center justify-center  py-3  rounded-lg bg-white/10 border border-white/20">
                    <Wallet className="w-6 h-6 mb-1 text-white/80" />
                    <h3 className="text-white/60 text-sm font-medium mb-1">
                      Total Group Expenses
                    </h3>
                    <div className="text-white">
                      <span className="text-2xl font-semibold">
                        {groupData.group.currency}{" "}
                        {groupData.group.totalExpenses}
                      </span>
                    </div>
                  </div>

                  {/* Total Budget */}
                  <div className="flex flex-col items-center justify-center  py-3 rounded-lg bg-white/10 border border-white/20">
                    <PiggyBank className="w-6 h-6 mb-1 text-white/80" />
                    <h3 className="text-white/60 text-sm font-medium mb-1">
                      Group Budget
                    </h3>
                    <div className="text-white">
                      <span className="text-2xl font-semibold">
                        {groupData.group.currency} {groupData.group.budget}
                      </span>
                    </div>
                  </div>

                  {/* You Owe */}
                  <div className="flex flex-col items-center justify-center  py-3 rounded-lg bg-white/10 border border-white/20">
                    <ArrowUpRight className="w-6 h-6 mb-1 text-red-300" />
                    <h3 className="text-white/60 text-sm font-medium mb-1">
                      You Owe
                    </h3>
                    <div className="text-white">
                      <span className="text-2xl font-semibold">
                        {groupData.group.currency} {""}
                        {summaryData.data.totals.totalOwed}
                      </span>
                    </div>
                  </div>

                  {/* People Owe You */}
                  <div className="flex flex-col items-center justify-center py-3 rounded-lg bg-white/10 border border-white/20">
                    <ArrowDownRight className="w-6 h-6 mb-1 text-green-300" />
                    <h3 className="text-white/60 text-sm font-medium mb-1">
                      Owed to You
                    </h3>
                    <div className="text-white">
                      <span className="text-2xl font-semibold">
                        {groupData.group.currency} {""}
                        {summaryData.data.totals.totalToReceive}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-7 mb-5">
              <button
                onClick={() => setActiveSecondaryTab("received")}
                className={`px-5 py-2 rounded-xl font-medium ${
                  activeSecondaryTab === "received"
                    ? "bg-stone-200 text-gray-900"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                To Receive From
              </button>
              <button
                onClick={() => setActiveSecondaryTab("paying")}
                className={`px-5 py-2 rounded-xl font-medium ${
                  activeSecondaryTab === "paying"
                    ? "bg-[#554CCF]/80 text-black"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                To Pay
              </button>
            </div>
          </div>
        )}

        {activeTab === "summary" && (
          <ScrollArea className="h-[calc(100vh-435px)]">
            {activeSecondaryTab === "received" ? (
              <>
                <>
                  <div className="space-y-4">
                    {summaryData?.data?.receivables?.map((receivable) => (
                      <div
                        key={receivable.expenseId}
                        className="bg-white rounded-xl p-6 border border-gray-100"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex justify-between mb-3">
                              <span className="text-lg font-semibold">
                                {receivable.description}
                              </span>
                            </div>
                            <div className="grid grid-cols-3 gap-6">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="w-4 h-4 text-indigo-500" />
                                {new Date(receivable.date).toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Users className="w-4 h-4 text-green-500" />
                                Total Amount: NPR{" "}
                                {receivable.totalAmount.toFixed(0)}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <PieChart className="w-4 h-4 text-orange-500" />
                                {receivable.category.charAt(0).toUpperCase() +
                                  receivable.category.slice(1)}
                              </div>
                            </div>
                          </div>
                          <div className="ml-6">
                            <p className="text-md font-bold flex gap-2 bg-green-100 text-green-700 p-1.5 rounded-2xl">
                              <Wallet />
                              NPR {receivable.owedToYou.toFixed(0)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              </>
            ) : (
              <div className="space-y-4">
                {summaryData?.data?.debts?.map((debt) => (
                  <div
                    key={debt.expenseId}
                    className="bg-white rounded-xl p-6 border border-gray-100"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex justify-between mb-3">
                          <span className="text-lg font-semibold">
                            {debt.description}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-6">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4 text-indigo-500" />
                            {new Date(debt.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Users className="w-4 h-4 text-green-500" />
                            Owed to: {debt.owedTo.name}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <PieChart className="w-4 h-4 text-orange-500" />
                            {debt.category.charAt(0).toUpperCase() +
                              debt.category.slice(1)}
                          </div>
                        </div>
                      </div>
                      <div className="ml-6">
                        <p className="text-md font-bold flex gap-2 bg-red-100 text-red-700 p-1.5 rounded-2xl">
                          <Wallet />
                          NPR {debt.amount.toFixed(0)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        )}
      </main>

      {/* Expense Details Dialog */}
      <ExpenseDetailsDialog
        expense={selectedExpense}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        currency={groupData?.group?.currency}
      />
    </div>
  );
}

export default SingleGroup;
