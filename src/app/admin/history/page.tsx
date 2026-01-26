import { History, Smartphone, Monitor, Globe } from 'lucide-react';

export default function HistoryPage() {
  const activities = [
    { action: 'Login Successful', device: 'Chrome on MacOS', ip: '112.198.10.2', time: 'Just now', icon: Monitor },
    { action: 'Updated Inquiry #8291', device: 'Chrome on MacOS', ip: '112.198.10.2', time: '2 hours ago', icon: Monitor },
    { action: 'Login Successful', device: 'Safari on iPhone', ip: '120.28.11.5', time: 'Yesterday, 8:42 PM', icon: Smartphone },
    { action: 'Archived Inquiry #1023', device: 'Firefox on Windows', ip: '49.145.2.9', time: 'Jan 24, 2026', icon: Monitor },
    { action: 'Failed Login Attempt', device: 'Unknown Device', ip: '182.55.22.1', time: 'Jan 20, 2026', icon: Globe, alert: true },
  ];

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <h1 className="text-3xl font-serif font-bold text-base-content mb-8">Activity History</h1>

      <div className="bg-white rounded-[24px] shadow-sm border border-base-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="bg-base-100 text-base-content/60">
                <th className="py-4 pl-8">Action</th>
                <th>Device</th>
                <th>IP Address</th>
                <th className="pr-8 text-right">Time</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((item, index) => {
                const Icon = item.icon;
                return (
                  <tr key={index} className="hover:bg-base-50 transition-colors border-b border-base-100 last:border-0">
                    <td className="py-4 pl-8">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.alert ? 'bg-red-100 text-red-500' : 'bg-primary/10 text-primary'}`}>
                          <Icon size={18} />
                        </div>
                        <span className={`font-bold ${item.alert ? 'text-red-500' : 'text-base-content'}`}>{item.action}</span>
                      </div>
                    </td>
                    <td className="text-base-content/70">{item.device}</td>
                    <td className="font-mono text-xs text-base-content/50">{item.ip}</td>
                    <td className="pr-8 text-right text-sm text-base-content/60">{item.time}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}