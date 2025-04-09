import AnalysisResult from "./GitHubAnalysis";

interface Props {
  params: {
    username: string;
  };
}

const Page = ({ params }: Props) => {    
  return <AnalysisResult githubUsername={params.username} />;
};

export default Page;
