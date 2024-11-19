const demoNotifications = [
    { id: '1', message: 'New request from Education For All', time: '2 hours ago' },
    { id: '2', message: 'Your donation was received by Local Food Bank', time: '1 day ago' },
    { id: '3', message: 'Green Earth Initiative posted a new event', time: '3 days ago' },
];

export default function Notifications() {
    return (
        <div className="space-y-6">
        <h1 className="text-2xl font-bold text-orange-800">Notifications</h1>
        <div className="space-y-4">
            {demoNotifications.map((notification) => (
            <div key={notification.id} className="bg-white p-4 rounded-lg shadow-md">
                <p className="text-orange-800">{notification.message}</p>
                <p className="text-sm text-orange-600 mt-1">{notification.time}</p>
            </div>
            ))}
        </div>
        </div>
    );
}