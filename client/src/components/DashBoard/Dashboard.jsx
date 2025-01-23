import { useState } from "react";
import {
  BarChart3,
  DollarSign,
  Download,
  Plus,
  TrendingDown,
  TrendingUp,
  Upload,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import Side_bar from "./Side_bar";
// import { LogoutButton } from '../Header/LogoutButton';
// import { LogoutButton } from '../Header/LogoutButton';

function App() {
  const [monthlyBudget] = useState(5000);
  const [currentSpent] = useState(3250);

  const recentTransactions = [
    {
      id: 1,
      description: "Grocery Shopping",
      amount: -120.5,
      date: "2024-03-20",
      category: "Food",
    },
    {
      id: 2,
      description: "Salary Deposit",
      amount: 3000.0,
      date: "2024-03-19",
      category: "Income",
    },
    {
      id: 3,
      description: "Netflix Subscription",
      amount: -15.99,
      date: "2024-03-18",
      category: "Entertainment",
    },
    {
      id: 4,
      description: "Gas Station",
      amount: -45.0,
      date: "2024-03-17",
      category: "Transportation",
    },
  ];

  const spendingByCategory = [
    { category: "Food", amount: 850, percentage: 26 },
    { category: "Housing", amount: 1200, percentage: 37 },
    { category: "Transportation", amount: 400, percentage: 12 },
    { category: "Entertainment", amount: 300, percentage: 9 },
    { category: "Others", amount: 500, percentage: 16 },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div>
        <Side_bar />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">
                  Track your travel spending and savings
                </p>
              </div>
              <div className="flex gap-4">
                <Select defaultValue="march">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="march">March 2024</SelectItem>
                    <SelectItem value="february">February 2024</SelectItem>
                    <SelectItem value="january">January 2024</SelectItem>
                  </SelectContent>
                </Select>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Expense
                </Button>
              </div>
            </div>

            {/* Overview Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                    <DollarSign className="h-6 w-6 text-blue-700 dark:text-blue-300" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Monthly Budget
                    </p>
                    <p className="text-2xl font-bold">
                      ${monthlyBudget.toLocaleString()}
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
                    <TrendingDown className="h-6 w-6 text-green-700 dark:text-green-300" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Spent this Month
                    </p>
                    <p className="text-2xl font-bold">
                      ${currentSpent.toLocaleString()}
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900">
                    <TrendingUp className="h-6 w-6 text-purple-700 dark:text-purple-300" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Remaining</p>
                    <p className="text-2xl font-bold">
                      ${(monthlyBudget - currentSpent).toLocaleString()}
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-orange-100 p-3 dark:bg-orange-900">
                    <BarChart3 className="h-6 w-6 text-orange-700 dark:text-orange-300" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Budget Used</p>
                    <p className="text-2xl font-bold">
                      {((currentSpent / monthlyBudget) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Recent Transactions */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Recent Transactions
                </h2>
                <div className="space-y-4">
                  {recentTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`rounded-full p-2 ${
                            transaction.amount > 0
                              ? "bg-green-100 dark:bg-green-900"
                              : "bg-red-100 dark:bg-red-900"
                          }`}
                        >
                          {transaction.amount > 0 ? (
                            <Download className="h-4 w-4 text-green-700 dark:text-green-300" />
                          ) : (
                            <Upload className="h-4 w-4 text-red-700 dark:text-red-300" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">
                            {transaction.description}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {transaction.category} • {transaction.date}
                          </p>
                        </div>
                      </div>
                      <p
                        className={`font-semibold ${
                          transaction.amount > 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.amount > 0 ? "+" : ""}$
                        {Math.abs(transaction.amount).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Spending by Category */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Spending by Category
                </h2>
                <div className="space-y-4">
                  {spendingByCategory.map((category) => (
                    <div key={category.category} className="space-y-2">
                      <div className="flex justify-between">
                        <p className="font-medium">{category.category}</p>
                        <p className="text-muted-foreground">
                          ${category.amount.toLocaleString()} (
                          {category.percentage}%)
                        </p>
                      </div>
                      <Progress value={category.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
