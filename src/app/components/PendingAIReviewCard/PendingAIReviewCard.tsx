import { Lock } from 'lucide-react';

export default function PendingAIReviewCard() {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-white dark:bg-gray-950 p-6 shadow-sm transition hover:shadow-md">
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-full">
          <Lock className="w-6 h-6 text-gray-500 dark:text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          AI Review Not Available
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs">
          This user hasn’t run an AI code review yet. Once available, you’ll be able to see insights about code quality, documentation, and security.
        </p>
      </div>
    </div>
  );
}
