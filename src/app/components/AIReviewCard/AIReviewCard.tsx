import Link from "next/link";

interface AIReviewData {
      overallRating: number;
      codeQualityRating: number;
      securityRating: number;
      documentationRating: number;
      summary: string;
      strengths: string[];
      improvementAreas: string[];
  }


 type AIReviewCardProps = {
    data: AIReviewData;
    username: string;
  };

const ScoreItem = ({ label, score }: { label: string; score: number }) => (
  <div className="flex justify-between items-center border rounded-xl px-4 py-2 bg-gray-50 dark:bg-gray-900">
    <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
    <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{score}/10</span>
  </div>
);


export default function AIReviewCard({ data, username }: AIReviewCardProps) {
  return (
    <div className="w-full rounded-2xl border bg-white dark:bg-gray-950 p-5 shadow-sm">
      <h2 className="text-base font-semibold mb-3 text-gray-800 dark:text-gray-200">
        AI Review Summary
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <ScoreItem label="Overall Rating" score={data?.overallRating} />
        <ScoreItem label="Code Quality" score={data?.codeQualityRating} />
        <ScoreItem label="Security" score={data?.securityRating} />
        <ScoreItem label="Documentation" score={data?.documentationRating} />
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap mb-4">
        {data?.summary.slice(0, 150)}{data?.summary.length > 150 ? "..." : ""}
      </p>


      <Link
        href={`/${username}/GitHubAnalysis`}
        className="text-sm font-medium text-blue-600 hover:underline"
      >
        View Full Analysis →
      </Link>
    </div>
  );
}
