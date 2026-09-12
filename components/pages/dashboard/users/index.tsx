import { OverviewStats } from "./partials/overview-stats";
import { RevenueChart } from "./partials/revenue-chart";
import { InsightReminder } from "./partials/insight-reminder";
import { TopProducts } from "./partials/top-products";
import { RecentActivities } from "./partials/recent-activities";

export function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 w-full pb-10">
      {/* Top Stats Cards */}
      <section>
        <OverviewStats />
      </section>

      {/* Middle Section*/}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8">
          <RevenueChart />
        </div>
        <div className="xl:col-span-4">
          <InsightReminder />
        </div>
      </section>

      {/* Bottom Section */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-6">
          <TopProducts />
        </div>
        <div className="xl:col-span-6">
          <RecentActivities />
        </div>
      </section>
    </div>
  );
}
