import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function AssetsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header title="Assets" description="Manage your assets and investments" />

      <div className="p-6 space-y-6">
        {/* Summary Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Total Assets</CardTitle>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Asset
            </Button>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              ¥10,687,220
            </div>
          </CardContent>
        </Card>

        {/* Asset List Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Asset List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              Asset CRUD will be implemented in Phase B
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
