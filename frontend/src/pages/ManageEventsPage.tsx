import { EventManagementTable } from '@/components/admin/EventManagementTable';

export default function ManageEventsPage() {
  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <EventManagementTable />
      </div>
    </div>
  );
}
