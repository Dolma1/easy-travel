import React from "react";
import {
  X,
  User,
  Calendar,
  Tag,
  Clock,
  Users,
  Receipt,
  AlertCircle,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const ExpenseDetailsModal = ({ expense, currency, isOpen, onClose }) => {
  // Ensure the component has a fallback if no expense is provided
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl animate-modal-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Expense Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Basic Info */}
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold capitalize text-gray-900">
                  {expense.description}
                </h3>
                <p className="text-gray-500 mt-1">{expense.category}</p>
              </div>
              <div className="text-2xl font-bold text-green-600 bg-green-50 px-4 py-2 rounded-xl">
                {currency} {expense.amount?.toFixed(2)}
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  icon: <User className="w-5 h-5" />,
                  iconBg: "bg-blue-100 text-blue-600",
                  label: "Paid By",
                  value: expense.paidBy.name,
                },
                {
                  icon: <Calendar className="w-5 h-5" />,
                  iconBg: "bg-purple-100 text-purple-600",
                  label: "Date",
                  value: new Date(expense.date).toLocaleDateString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }),
                },
                {
                  icon: <Tag className="w-5 h-5" />,
                  iconBg: "bg-amber-100 text-amber-600",
                  label: "Category",
                  value: expense.category,
                },
                {
                  icon: <Clock className="w-5 h-5" />,
                  iconBg: "bg-emerald-100 text-emerald-600",
                  label: "Status",
                  value: expense.status,
                  valueClass:
                    expense.status === "Pending"
                      ? "text-amber-600"
                      : "text-emerald-600",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className={`p-2 rounded-full ${item.iconBg}`}>
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{item.label}</p>
                    <p
                      className={`font-medium capitalize ${
                        item.valueClass || ""
                      }`}
                    >
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Split Details */}
          <div className="bg-gray-50 rounded-2xl p-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2 px-4 pt-3">
              <Users className="w-5 h-5 text-blue-600" />
              Split Details
            </h3>
            <div className="space-y-2">
              {expense.splitBetween.map((person) => (
                <div
                  key={person.user._id}
                  className={`flex justify-between items-center p-3 rounded-xl transition-colors ${
                    person._id === expense.paidBy._id
                      ? "bg-blue-50 hover:bg-blue-100"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Avatar
                      className={`w-10 h-10 border ${
                        person._id === expense.paidBy._id
                          ? "bg-blue-100"
                          : "bg-gray-100"
                      }`}
                    >
                      <AvatarImage src={person.user?.avatar?.url} />
                      <AvatarFallback
                        className={`${
                          person._id === expense.paidBy._id
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {person.user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="font-medium">{person.user.name}</span>
                      {person._id === expense.paidBy._id && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                          Paid
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`font-semibold ${
                        person._id === expense.paidBy._id
                          ? "text-blue-800"
                          : "text-gray-900"
                      }`}
                    >
                      {currency} {Number(person.share).toFixed(2)}
                    </div>

                    <Badge
                      variant={
                        person.status === "paid" ? "outline" : "destructive"
                      }
                      className="capitalize mt-2"
                    >
                      {person.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Receipt */}
          {expense.receipt && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-indigo-600" />
                Receipt
              </h3>
              <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                {expense.receipt.url ? (
                  <img
                    src={expense.receipt.url}
                    alt="Expense receipt"
                    className="w-full h-auto max-h-64 object-contain bg-gray-100 hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="p-8 text-center bg-gray-50">
                    <p className="text-gray-500">No receipt available</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          {expense.notes?.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                Notes
              </h3>
              {expense.notes.map((note, index) => (
                <p
                  key={index}
                  className="text-gray-600 bg-gray-50 p-3 rounded-xl mb-2"
                >
                  {note}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseDetailsModal;
