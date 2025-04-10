import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { SideBar } from "..";
import GroupNav from "./GroupNav";
import {
  useCompletePaymentMutation,
  useDisputeExpenseMutation,
  useGetSingleExpenseQuery,
  useInitiatePaymentMutation,
  useExpenseSettlementMutation,
} from "@/app/slices/expenseApiSlice";
import {
  CalendarDays,
  Receipt,
  Wallet2,
  Users,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useCallback } from "react";

const Settlement = () => {
  const location = useLocation();
  let groupId = localStorage.getItem("groupId") || location.state?.groupId;

  const { expenseId } = useParams();
  const { data } = useGetSingleExpenseQuery(expenseId);
  const [showSettleModal, setShowSettleModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [note, setNote] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("cash");
  const userdata = useSelector((state) => state.auth?.user?._id);
  const [expenseSettlement] = useExpenseSettlementMutation();
  const [disputeExpense] = useDisputeExpenseMutation();
  const [initiateKhalti] = useInitiatePaymentMutation();
  const [completePayment] = useCompletePaymentMutation();
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);
  const navigate = useNavigate();

  const completePaymentHandler = async (pidx) => {
    try {
      const paymentData = await completePayment({ pidx, expenseId }).unwrap();
      if (paymentData.success) {
        setPaymentResult(paymentData);
        setShowSuccessPopup(true);
      }
      return;
    } catch (error) {
      toast.error(error?.data?.message || "Payment verification failed");
    }
  };
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const pidxFromUrl = urlParams.get("pidx");
    if (pidxFromUrl) {
      // await completePayment()
      completePaymentHandler(pidxFromUrl);
    }
    if (localStorage.getItem("groupId")) {
      return;
    } else {
      localStorage.setItem("groupId", location.state.groupId);
    }
  }, []);

  const resetForm = useCallback(() => {
    setShowSuccessPopup(false);
    // let id = localStorage.getItem('groupId')
    window.history.pushState(
      {},
      document.title,
      `/groups/settlements/${expenseId}`
    );
    // TODO: console.log(id); This is undefined+
    console.log(groupId);
    if (groupId) {
      navigate(`/groups/${groupId}`);
      localStorage.removeItem("groupId");
      window.location.reload();
      toast.success("Payment Successfull..");
    }
  }, [groupId, navigate]); // Add all dependencies here

  if (!data) return null;

  const expense = data.data;
  const formattedDate = new Date(expense.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleSettlement = async (action) => {
    try {
      const data = {
        expenseId,
        payment: selectedPaymentMethod,
        note,
      };
      if (action === "settle") {
        const response = await expenseSettlement(data).unwrap();
        if (response.success) {
          toast.success(response.messsage);
          navigate(-1);
        }
      } else if (action === "dispute") {
        const response = await disputeExpense(data).unwrap();
        if (response.success) {
          toast.success(response.messsage);
          navigate(-1);
        }
      }
    } catch (error) {
      console.error("Settlement failed:", error);
    } finally {
      setShowSettleModal(false);
      setNote("");
      setSelectedAction(null);
    }
  };
  const userShare =
    expense.splitBetween.find((split) => split.user._id === userdata)?.share ||
    0;

  const initiatePayment = async (data) => {
    console.log(data);
    try {
      const response = await initiateKhalti(data).unwrap();
      console.log(response);
      if (response.success) {
        window.location.href = response?.payment_url;
      }
      if (response.error) {
        toast.error(error.data.message);
      }
    } catch (error) {
      toast.error(error.data?.message || "Payment initation failed");
    }
  };

  // const resetForm = useCallback(() => {
  //   setShowSuccessPopup(false);
  //   navigate(`groups/${id}`);
  //   window.location.reload();
  // }, []);

  return (
    <div className="flex w-full bg-gray-50">
      <SideBar />
      <div className="flex-1">
        <GroupNav id={groupId} />
        <div className="max-w-4xl mx-auto px-4  mt-10">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#5751b8] to-[#3b358e] px-6 py-4 text-white">
              <h1 className="text-3xl font-bold mb-2">₹{expense.amount}</h1>
              <p className="text-blue-100">{expense.description}</p>
              <div className="mt-4 flex items-center">
                <Avatar>
                  <AvatarImage src={expense.paidBy?.avatar?.url} />
                  <AvatarFallback className="text-gray-800 font-semibold text-xl">
                    {expense.paidBy.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <p className="ml-2 text-sm text-blue-100">
                  Paid by{" "}
                  <span className="font-semibold">{expense.paidBy.name}</span>
                </p>
              </div>
            </div>

            {/* Details Grid */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <CalendarDays className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{formattedDate}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <Receipt className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-medium capitalize">{expense.category}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <Wallet2 className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="font-medium capitalize">
                    {expense.paymentMethod}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-orange-100 p-3 rounded-full">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium capitalize">{expense.status}</p>
                </div>
              </div>
            </div>

            {/* Split Details */}
            <div className="border-t border-gray-100 p-6">
              <h2 className="text-lg font-semibold mb-4">Split Details</h2>
              <div className="space-y-4">
                {expense.splitBetween.map((split) => {
                  return userdata === split.user._id ? (
                    <div
                      key={split._id}
                      className="flex items-center justify-between bg-gray-50 p-4 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={split.user?.avatar?.url} />
                          <AvatarFallback className="text-gray-800 font-semibold bg-slate-300 text-xl">
                            {split?.user?.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{split.user.name}</p>
                          <p className="text-sm text-gray-500">Needs to pay</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="font-semibold text-lg">
                          ₹{split.share}
                        </span>
                        <Button
                          onClick={() => {
                            setShowSettleModal(true);
                            setSelectedAction(null);
                          }}
                        >
                          Settle
                        </Button>
                      </div>
                    </div>
                  ) : null;
                })}
              </div>
            </div>

            {/* Settlement Modal */}
            {showSettleModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold">
                      Settlement Options
                    </h3>
                    <button
                      onClick={() => setShowSettleModal(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  {!selectedAction ? (
                    <div className="space-y-4">
                      <button
                        onClick={() => setSelectedAction("settle")}
                        className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center">
                          <CheckCircle2 className="w-6 h-6 text-green-600 mr-3" />
                          <div>
                            <p className="font-medium">Settle Payment</p>
                            <p className="text-sm text-gray-500">
                              Mark this expense as paid
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400" />
                      </button>

                      <button
                        onClick={() => setSelectedAction("dispute")}
                        className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center">
                          <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
                          <div>
                            <p className="font-medium">Raise Dispute</p>
                            <p className="text-sm text-gray-500">
                              Report an issue with this expense
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {selectedAction === "settle" && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Payment Method
                            </label>
                            <select
                              value={selectedPaymentMethod}
                              onChange={(e) =>
                                setSelectedPaymentMethod(e.target.value)
                              }
                              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="cash">Cash</option>
                              <option value="khalti">Khalti</option>
                            </select>
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {selectedAction === "settle"
                            ? selectedPaymentMethod === "cash"
                              ? "Add a note (optional)"
                              : ""
                            : "Reason for dispute"}
                        </label>
                        {selectedPaymentMethod === "khalti" ? (
                          <></>
                        ) : (
                          <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            rows={3}
                            placeholder={
                              selectedAction === "settle"
                                ? "Add any additional information..."
                                : "Please explain the reason for the dispute..."
                            }
                          />
                        )}
                      </div>

                      <div className="flex space-x-3 pt-4">
                        <button
                          onClick={() => setSelectedAction(null)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                          Back
                        </button>

                        {selectedAction === "settle" &&
                          selectedPaymentMethod === "cash" && (
                            <Button
                              onClick={() => handleSettlement("settle")}
                              className={`flex-1 px-4 py-2 text-white rounded-lg ${
                                selectedPaymentMethod === "cash"
                                  ? "text-black"
                                  : "bg-purple-600 hover:bg-purple-700"
                              }`}
                            >
                              Settle with Cash
                            </Button>
                          )}
                        {selectedAction === "settle" &&
                          selectedPaymentMethod === "khalti" && (
                            <Button
                              onClick={() =>
                                initiatePayment({
                                  amount: userShare,
                                  expenseId: expenseId,
                                  paidTo: expense.paidBy,
                                })
                              }
                              className={`flex-1 px-4 py-2 text-white rounded-lg ${
                                selectedPaymentMethod === "cash"
                                  ? "text-black"
                                  : "bg-purple-600 hover:bg-purple-700"
                              }`}
                            >
                              Pay with Khalti
                            </Button>
                          )}

                        {selectedAction !== "settle" && (
                          <Button
                            onClick={() => handleSettlement("dispute")}
                            className="flex-1 px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg"
                          >
                            Submit Dispute
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            {showSuccessPopup && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-fade-in">
                  <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                      <CheckCircle2 className="h-6 w-6 text-indigo-800" />
                    </div>
                    <h3 className="mt-3 text-lg font-medium text-gray-900">
                      Payment Successful!
                    </h3>
                    <div className="mt-2 text-sm text-gray-500">
                      <p>Your payment has been processed successfully.</p>

                      {paymentResult?.paymentInfo && (
                        <div className="mt-4 bg-gray-50 p-3 rounded-lg text-left">
                          <h4 className="font-medium text-gray-700 mb-2">
                            Transaction Details:
                          </h4>
                          <div className="space-y-1">
                            <p className="flex justify-between">
                              <span className="font-medium">Amount:</span>
                              <span>
                                NPR {paymentResult.paymentInfo.total_amount}
                              </span>
                            </p>
                            <p className="flex justify-between">
                              <span className="font-medium">
                                Transaction ID:
                              </span>
                              <span className="font-mono">
                                {paymentResult.paymentInfo.transaction_id}
                              </span>
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-5">
                    <button
                      onClick={resetForm}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settlement;
