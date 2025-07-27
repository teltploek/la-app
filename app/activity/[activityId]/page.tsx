import ActivityPageClient from "./ActivityPageClient";

export default async function ActivityPage({ params }: { params: Promise<{ activityId: string }> }) {
  const { activityId } = await params;
  
  return <ActivityPageClient activityId={activityId} />;
}