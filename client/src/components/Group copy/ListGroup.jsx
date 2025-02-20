import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Calendar,
  Tag,
  User,
  CreditCard,
  FileText,
  AlertCircle,
  Receipt,
  DollarSign,
  Users,
} from "lucide-react";

// Mock data for demonstration
const mockExpenses = [
  {
    _id: "1",
    group: "trip2024",
    description: "Hotel Booking - Marriott",
    amount: { value: 1200, currency: "USD" },
    category: "accommodation",
    paidBy: {
      user: {
        _id: "1",
        name: "John Doe",
        email: "john@example.com",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      },
      paymentMethod: "card",
    },
    splitBetween: [
      {
        user: { _id: "1", name: "John Doe", email: "john@example.com" },
        share: 400,
      },
      {
        user: { _id: "2", name: "Jane Smith", email: "jane@example.com" },
        share: 400,
      },
      {
        user: { _id: "3", name: "Mike Johnson", email: "mike@example.com" },
        share: 400,
      },
    ],
    date: "2024-03-15T10:00:00Z",
    status: "settled",
    notes: "Ocean view room for 3 nights",
    createdAt: "2024-03-15T10:00:00Z",
    updatedAt: "2024-03-15T10:00:00Z",
  },
  {
    _id: "2",
    group: "trip2024",
    description: "Flight Tickets",
    amount: { value: 2500, currency: "USD" },
    category: "transport",
    paidBy: {
      user: {
        _id: "2",
        name: "Jane Smith",
        email: "jane@example.com",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      },
      paymentMethod: "card",
    },
    splitBetween: [
      {
        user: { _id: "1", name: "John Doe", email: "john@example.com" },
        share: 833.33,
      },
      {
        user: { _id: "2", name: "Jane Smith", email: "jane@example.com" },
        share: 833.33,
      },
      {
        user: { _id: "3", name: "Mike Johnson", email: "mike@example.com" },
        share: 833.34,
      },
    ],
    date: "2024-03-14T15:30:00Z",
    status: "settled",
    receipt: {
      url: "https://example.com/receipt.pdf",
      uploadedAt: "2024-03-14T15:35:00Z",
    },
    createdAt: "2024-03-14T15:30:00Z",
    updatedAt: "2024-03-14T15:30:00Z",
  },
  {
    _id: "3",
    group: "trip2024",
    description: "Restaurant - Seafood Night",
    amount: { value: 450, currency: "USD" },
    category: "food",
    paidBy: {
      user: {
        _id: "3",
        name: "Mike Johnson",
        email: "mike@example.com",
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
      },
      paymentMethod: "cash",
    },
    splitBetween: [
      {
        user: { _id: "1", name: "John Doe", email: "john@example.com" },
        share: 150,
      },
      {
        user: { _id: "2", name: "Jane Smith", email: "jane@example.com" },
        share: 150,
      },
      {
        user: { _id: "3", name: "Mike Johnson", email: "mike@example.com" },
        share: 150,
      },
    ],
    date: "2024-03-16T19:00:00Z",
    status: "pending",
    notes: "Dinner at Ocean Breeze Restaurant",
    createdAt: "2024-03-16T19:00:00Z",
    updatedAt: "2024-03-16T19:00:00Z",
  },
  {
    _id: "4",
    group: "trip2024",
    description: "Scuba Diving Experience",
    amount: { value: 900, currency: "USD" },
    category: "activities",
    paidBy: {
      user: {
        _id: "1",
        name: "John Doe",
        email: "john@example.com",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      },
      paymentMethod: "card",
    },
    splitBetween: [
      {
        user: { _id: "1", name: "John Doe", email: "john@example.com" },
        share: 300,
      },
      {
        user: { _id: "2", name: "Jane Smith", email: "jane@example.com" },
        share: 300,
      },
      {
        user: { _id: "3", name: "Mike Johnson", email: "mike@example.com" },
        share: 300,
      },
    ],
    date: "2024-03-17T09:00:00Z",
    status: "disputed",
    notes: "Equipment rental included",
    receipt: {
      url: "https://example.com/scuba-receipt.pdf",
      uploadedAt: "2024-03-17T09:05:00Z",
    },
    createdAt: "2024-03-17T09:00:00Z",
    updatedAt: "2024-03-17T09:00:00Z",
  },
];

const getStatusColor = (status) => {
  switch (status) {
    case "settled":
      return "bg-green-100 text-green-800";
    case "disputed":
      return "bg-red-100 text-red-800";
    default:
      return "bg-yellow-100 text-yellow-800";
  }
};

function App() {
  const [expenses] = useState(mockExpenses);
  const [totalExpenses, setTotalExpenses] = useState(0);

  useEffect(() => {
    const total = expenses.reduce(
      (sum, expense) => sum + expense.amount.value,
      0
    );
    setTotalExpenses(total);
  }, [expenses]);

  return (
    <ScrollArea className="h-[calc(100vh-130px)] ">

    <div className="min-h-screen bg-gray-50 ">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Expenses
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      ${totalExpenses}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Receipt className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Number of Expenses
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {expenses.length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Active Members
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">3</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Expense List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {expenses.map((expense) => (
              <li key={expense._id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <img
                          className="h-12 w-12 rounded-full"
                          src={
                            expense.paidBy.user.avatar ||
                            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
                          }
                          alt={expense.paidBy.user.name}
                        />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">
                          {expense.description}
                        </h3>
                        <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <User className="flex-shrink-0 mr-1.5 h-4 w-4" />
                            <p>Paid by {expense.paidBy.user.name}</p>
                          </div>
                          {expense.paidBy.paymentMethod && (
                            <div className="flex items-center">
                              <CreditCard className="flex-shrink-0 mr-1.5 h-4 w-4" />
                              <p className="capitalize">
                                {expense.paidBy.paymentMethod}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                        {expense.amount.value} {expense.amount.currency}
                      </span>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          expense.status
                        )}`}
                      >
                        {expense.status}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex space-x-6">
                      <div className="flex items-center text-sm text-gray-500">
                        <Tag className="flex-shrink-0 mr-1.5 h-4 w-4" />
                        <span className="capitalize">{expense.category}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4" />
                        {new Date(expense.date).toLocaleDateString()}
                      </div>
                      {expense.receipt?.url && (
                        <div className="flex items-center text-sm text-gray-500">
                          <FileText className="flex-shrink-0 mr-1.5 h-4 w-4" />
                          <a
                            href={expense.receipt.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Receipt
                          </a>
                        </div>
                      )}
                    </div>
                    {expense.notes && (
                      <div className="mt-2 sm:mt-0 text-sm text-gray-500">
                        <AlertCircle className="flex-shrink-0 mr-1.5 h-4 w-4" />
                        {expense.notes}
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
    </ScrollArea>

  );
}

export default App;
