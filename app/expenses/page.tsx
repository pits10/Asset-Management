import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function ExpensesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header title="Expenses" description="Track your fixed and variable expenses" />

      <div className="p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Monthly Total Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-500">
                ¥180,000
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Fixed vs Variable
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div>
                  <div className="text-xs text-muted-foreground">Fixed</div>
                  <div className="text-xl font-bold">¥100,000</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Variable</div>
                  <div className="text-xl font-bold">¥80,000</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Expense List */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Expense List</CardTitle>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Expense
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              Expense CRUD will be implemented in Phase B
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
