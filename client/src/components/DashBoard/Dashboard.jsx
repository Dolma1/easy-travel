import { useState } from "react";
import {
  BarChart3,
  DollarSign,
  Download,
  Plus,
  TrendingDown,
  TrendingUp,
  Upload,
  CalendarIcon,
  BookOpen,
  Plane,
  BadgeDollarSignIcon,
  TrendingDownIcon,
  DollarSignIcon,
  IndianRupeeIcon,
  EuroIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "../ui/scroll-area";
import { DashboardNav } from "../index";
import { useGetDashboardDataQuery } from "@/app/slices/userApiSlice";
import { Link } from "react-router-dom";

function Dashboard() {
  // Use the actual data from API
  const { data } = useGetDashboardDataQuery();
  const dashboardData = data?.dashboardData || {};

  // Extract data from API response
  const profile = dashboardData.profile || {};
  const finances = dashboardData.finances || {};
  const trips = dashboardData.trips || {};
  const activity = dashboardData.activity || {};

  // Financial data
  const totalPaid = finances.summary?.totalPaid || 0;
  const totalOwed = finances.summary?.totalOwed || 0;
  const netBalance = finances.summary?.netBalance || 0;

  // Get real expenses from API
  const recentExpenses = finances.recentExpenses || [];
  const [searchData, setSearchData] = useState(recentExpenses);

  // Create spending by category from categoryBreakdown
  const upcoming = trips?.upcoming || [];

  // Format monetary values
  const formatCurrency = (amount) => {
    return amount?.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  function getCurrencyIcon(currency) {
    const currencyIcons = {
      USD: <DollarSignIcon className="w-4 h-4" />,
      NPR: <IndianRupeeIcon className="w-4 h-4" />,
      INR: <IndianRupeeIcon className="w-4 h-4" />,
      EUR: <EuroIcon className="w-4 h-4"/>,
    };

    return currencyIcons[currency] || currency; // Return the icon or the currency code if not found
  }

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="flex-1 overflow-auto">
      <DashboardNav originalData={recentExpenses} />
      <ScrollArea className="h-[calc(100vh-100px)]">
        <div className="py-5 px-8">
          <div className="mx-auto max-w-7xl space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-3">Dashboard</h1>
                <p className="text-muted-foreground">
                  Welcome, {profile.name || "User"}! Track your travel spending
                  and savings
                </p>
              </div>
            </div>

            {/* Overview Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                    <BadgeDollarSignIcon className="h-6 w-6 text-blue-700 dark:text-blue-300" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Paid</p>
                    <p className="text-2xl font-bold">
                      Rs.{formatCurrency(totalPaid)}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-red-100 p-3 dark:bg-red-900">
                    <TrendingDownIcon className="h-6 w-6 text-red-700 dark:text-red-300" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Owned</p>
                    <p className="text-2xl font-bold">
                      Rs.{formatCurrency(totalOwed)}
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
                    <p className="text-sm text-muted-foreground">Net Balance</p>
                    <p className="text-2xl font-bold">
                      Rs.{formatCurrency(netBalance)}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-orange-100 p-3 dark:bg-orange-900">
                    <Plane className="h-6 w-6 text-orange-700 dark:text-orange-300" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Trips</p>
                    <p className="text-2xl font-bold">
                      {profile.totalTrips || 0}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Recent Transactions */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Recent Expenses</h2>
                <ScrollArea className="h-[33vh]">
                  <div className="space-y-4">
                    {recentExpenses.map((expense) => (
                      <div
                        key={expense.id}
                        className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                      >
                        <div className="flex items-center gap-4">
                          <div className="rounded-full bg-red-100 p-2 dark:bg-red-900">
                            <Upload className="h-4 w-4 text-red-700 dark:text-red-300" />
                          </div>
                          <div>
                            <p className="font-medium">{expense.description}</p>
                            <p className="text-sm text-muted-foreground">
                              {expense.category} • {formatDate(expense.date)}
                            </p>
                          </div>
                        </div>
                        <p className="font-semibold text-red-600 flex items-center ">
                          -{getCurrencyIcon(expense?.currency)}{" "}
                          {formatCurrency(expense.amount)}
                        </p>
                      </div>
                    ))}

                    {searchData.length === 0 && (
                      <div className="text-center py-4 text-muted-foreground">
                        No expenses found
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </Card>

              {/* Spending by Category */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Upcoming Trips</h2>
                <ScrollArea className="h-[33vh]">
                  <div className="space-y-4">
                    {upcoming.map((trip) => (
                      <Link
                        to={`/groups/${trip?.id}`}
                        key={trip.id}
                        className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                      >
                        <div className="flex items-center gap-4">
                          <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                            <Plane className="h-4 w-4 text-green-700 dark:text-green-300" />
                          </div>
                          <div>
                            <p className="font-medium">{trip.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {trip.destination} • {formatDate(trip.startDate)}{" "}
                              to {formatDate(trip.endDate)}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {trip.memberCount} members
                        </p>
                      </Link>
                    ))}

                    {(trips.active || []).length === 0 && (
                      <div className="text-center py-4 text-muted-foreground">
                        No active trips
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </Card>
            </div>

            {/* Additional Sections - Active Trips and Recent Journals */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Active Trips */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Active Trips</h2>
                <ScrollArea className="h-[33vh]">
                  <div className="space-y-4">
                    {(trips.active || []).map((trip) => (
                      <Link
                        to={`/groups/${trip?.id}`}
                        key={trip.id}
                        className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                      >
                        <div className="flex items-center gap-4">
                          <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                            <Plane className="h-4 w-4 text-blue-700 dark:text-blue-300" />
                          </div>
                          <div>
                            <p className="font-medium">{trip.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {trip.destination} • {formatDate(trip.startDate)}{" "}
                              to {formatDate(trip.endDate)}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {trip.memberCount} members
                        </p>
                      </Link>
                    ))}

                    {(trips.active || []).length === 0 && (
                      <div className="text-center py-4 text-muted-foreground">
                        No active trips
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </Card>

              {/* Recent Journals */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Recent Journals</h2>
                <ScrollArea className="h-[33vh]">
                  <div className="space-y-4">
                    {(activity.latestJournals || []).map((journal) => (
                      <Link to={`/journal/${journal?.id}`}
                        key={journal.id}
                        className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                      >
                        <div className="flex items-center gap-4">
                          <div className="rounded-full bg-purple-100 p-2 dark:bg-purple-900">
                            <BookOpen className="h-4 w-4 text-purple-700 dark:text-purple-300" />
                          </div>
                          <div>
                            <p className="font-medium">{journal.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {journal.mood} • {formatDate(journal.date)}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {journal.location}
                        </p>
                      </Link>
                    ))}

                    {(activity.latestJournals || []).length === 0 && (
                      <div className="text-center py-4 text-muted-foreground">
                        No journal entries
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </Card>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

export default Dashboard;
