import PageHeader from "../components/layout/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Button } from "../components/ui/button";
import { CreditCard, Download } from "lucide-react";

// Placeholder data for invoices
const invoiceData = [
  { id: "INV-001", date: "Jan 01, 2023", amount: "INR 3000", status: "Paid" },
  { id: "INV-002", date: "Feb 01, 2023", amount: "INR 3000", status: "Paid" },
  { id: "INV-003", date: "Mar 01, 2023", amount: "INR 3000", status: "Paid" },
  { id: "INV-004", date: "Apr 01, 2023", amount: "INR 3000", status: "Paid" },
  {
    id: "INV-005",
    date: "May 01, 2023",
    amount: "INR 3000",
    status: "Pending",
  },
];

const Billing = () => {
  return (
    <div>
      <PageHeader title="Billing" />

      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card className="bg-zinc-200 dark:bg-zinc-800 border-none shadow-sm">
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>
                You are currently on the Pro plan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Monthly fee</span>
                <span className="font-semibold">INR 3000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Calls included</span>
                <span className="font-semibold">2,000 / month</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Next billing date</span>
                <span className="font-semibold">June 01, 2023</span>
              </div>
            </CardContent>
            <CardFooter></CardFooter>
          </Card>

          <Card className="bg-zinc-200 dark:bg-zinc-800 border-none shadow-sm">
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>Manage your payment methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center space-x-4 p-4 border rounded-lg">
                <CreditCard className="h-12 w-12 text-primary" />
                <div>
                  <p className="font-semibold">Visa ending in 4242</p>
                  <p className="text-sm text-muted-foreground">
                    Expires 09/2025
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">
                Update Payment Method
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Card className="bg-zinc-200 dark:bg-zinc-800 border-none shadow-sm">
          <CardHeader>
            <CardTitle>Billing History</CardTitle>
            <CardDescription>View your past invoices</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoiceData.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell>{invoice.date}</TableCell>
                    <TableCell>{invoice.amount}</TableCell>
                    <TableCell>{invoice.status}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Billing;
