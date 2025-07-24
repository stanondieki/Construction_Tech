'use client';

// Chart component placeholder

// In a real implementation, we would import a chart library like Chart.js, D3, or Recharts
// For this implementation, we'll use a simple placeholder with HTML/CSS

export function ResourceAllocationChart() {
  // Mock data for resource allocation
  const resourceData = [
    { name: 'Concrete', allocated: 75, used: 65 },
    { name: 'Steel', allocated: 50, used: 42 },
    { name: 'Timber', allocated: 30, used: 28 },
    { name: 'Sand', allocated: 60, used: 45 },
    { name: 'Cement', allocated: 40, used: 39 },
  ];
  
  return (
    <div className="h-full flex flex-col justify-center">
      <div className="space-y-4">
        {resourceData.map((resource) => (
          <div key={resource.name} className="relative">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-gray-700 truncate">{resource.name}</span>
              <span className="text-gray-500">{resource.used} / {resource.allocated} units</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="h-4 rounded-full bg-blue-500"
                style={{ width: `${(resource.used / resource.allocated) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="text-xs text-gray-500 text-center mt-4">
        <p>Material usage vs allocation</p>
      </div>
    </div>
  );
}
