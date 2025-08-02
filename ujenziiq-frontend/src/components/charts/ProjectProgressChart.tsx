'use client';

// Chart component placeholder

// In a real implementation, we would import a chart library like Chart.js, D3, or Recharts
// For this implementation, we'll use a simple placeholder with HTML/CSS

type Project = {
  id: string;
  name: string;
  progress: number;
  // Other properties...
};

type ProjectProgressChartProps = {
  projects: Project[];
};

export function ProjectProgressChart({ projects }: ProjectProgressChartProps) {
  // Sort projects by progress for better visualization
  const sortedProjects = [...projects].sort((a, b) => b.progress - a.progress);
  
  return (
    <div className="h-full flex flex-col justify-center">
      {sortedProjects.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No project data available
        </div>
      ) : (
        <div className="space-y-4">
          {sortedProjects.map((project) => (
            <div key={project.id} className="relative">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700 truncate">{project.name}</span>
                <span className="text-gray-500">{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className={`h-4 rounded-full ${
                    project.progress < 25 ? "bg-red-500" : 
                    project.progress < 75 ? "bg-yellow-500" : 
                    "bg-green-500"
                  }`}
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="text-xs text-gray-500 text-center mt-4">
        <p>Project completion percentages</p>
      </div>
    </div>
  );
}
