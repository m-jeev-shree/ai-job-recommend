import { motion } from "framer-motion";
import {
  Brain,
  Target,
  FileSearch,
  TrendingUp,
  BookOpen,
  Shield,
  Activity,
  Zap,
  BarChart3,
  UserCheck,
  FileText,
  Cpu,
} from "lucide-react";
import ScoreCard from "../components/ScoreCard";
import ModuleCard from "../components/ModuleCard";
import SkillRadar from "../components/SkillRadar";
import RecommendationList from "../components/RecommendationList";
import AssessmentPanel from "../components/AssessmentPanel";
import Sidebar from "../components/Sidebar";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const Index = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-secondary">
                <Cpu className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-2xl font-bold gradient-text">AI Command Center</h1>
            </div>
            <p className="text-sm text-muted-foreground ml-12">
              Real-time AI-driven career intelligence • 12 active neural modules
            </p>
          </motion.div>

          {/* Score Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            <motion.div variants={itemVariants}>
              <ScoreCard
                title="AI Confidence"
                score={87}
                icon={<Brain className="w-4 h-4 text-primary" />}
                trend="up"
                trendValue="+5.2%"
                glowColor="primary"
                explanation="Based on 847 data points across all modules"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <ScoreCard
                title="Career Growth"
                score={73}
                icon={<TrendingUp className="w-4 h-4 text-glow-success" />}
                trend="up"
                trendValue="+12.1%"
                glowColor="success"
                explanation="Trajectory analysis from skill velocity"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <ScoreCard
                title="Resume Strength"
                score={68}
                icon={<FileText className="w-4 h-4 text-accent" />}
                trend="stable"
                trendValue="+1.8%"
                glowColor="accent"
                explanation="NLP-scored against 50K+ top resumes"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <ScoreCard
                title="Market Fit"
                score={82}
                icon={<Target className="w-4 h-4 text-primary" />}
                trend="up"
                trendValue="+8.4%"
                glowColor="primary"
                explanation="Competitiveness in target job market"
              />
            </motion.div>
          </motion.div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Skill Radar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-1"
            >
              <SkillRadar />
            </motion.div>

            {/* Assessment Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2"
            >
              <AssessmentPanel />
            </motion.div>
          </div>

          {/* Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <RecommendationList />
          </motion.div>

          {/* AI Modules Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">Neural Modules</h2>
              <span className="text-xs font-mono text-muted-foreground">• 12 systems online</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <ModuleCard
                title="User Profiling AI"
                description="NLP-driven skill extraction & career clustering"
                icon={<UserCheck className="w-4 h-4 text-primary" />}
                status="active"
                techniques={["NLP", "TF-IDF", "Embeddings"]}
              />
              <ModuleCard
                title="Adaptive Assessment"
                description="CAT-based dynamic question generation"
                icon={<Brain className="w-4 h-4 text-glow-success" />}
                status="active"
                techniques={["CAT", "Bloom's", "LLM"]}
              />
              <ModuleCard
                title="Answer Evaluation"
                description="AST comparison & semantic scoring"
                icon={<FileSearch className="w-4 h-4 text-accent" />}
                status="active"
                techniques={["AST", "Static Analysis", "LLM"]}
              />
              <ModuleCard
                title="Job Recommender"
                description="Hybrid filtering with learning-to-rank"
                icon={<Target className="w-4 h-4 text-primary" />}
                status="active"
                techniques={["Cosine Sim", "Collaborative", "GBM"]}
              />
              <ModuleCard
                title="Resume Matcher"
                description="Transformer embeddings & NER matching"
                icon={<FileText className="w-4 h-4 text-glow-success" />}
                status="active"
                techniques={["NER", "Transformers", "FAISS"]}
              />
              <ModuleCard
                title="Skill Gap Analysis"
                description="Predictive modeling & demand clustering"
                icon={<BarChart3 className="w-4 h-4 text-accent" />}
                status="active"
                techniques={["Prediction", "Clustering", "Trends"]}
              />
              <ModuleCard
                title="Course Engine"
                description="Reinforcement learning recommendations"
                icon={<BookOpen className="w-4 h-4 text-primary" />}
                status="active"
                techniques={["RL", "Bandit", "Behavioral"]}
              />
              <ModuleCard
                title="Career Predictor"
                description="Trajectory & salary prediction models"
                icon={<TrendingUp className="w-4 h-4 text-glow-success" />}
                status="active"
                techniques={["Regression", "GBM", "Time-Series"]}
              />
              <ModuleCard
                title="Behavioral Tracker"
                description="Engagement & churn prediction"
                icon={<Activity className="w-4 h-4 text-accent" />}
                status="active"
                techniques={["Scoring", "Drop-off", "Motivation"]}
              />
              <ModuleCard
                title="Security AI"
                description="Anomaly detection & fraud prevention"
                icon={<Shield className="w-4 h-4 text-glow-danger" />}
                status="active"
                techniques={["Anomaly", "Fraud", "Plagiarism"]}
              />
              <ModuleCard
                title="Integrity Monitor"
                description="Assessment proctoring & cheat detection"
                icon={<Shield className="w-4 h-4 text-glow-warning" />}
                status="active"
                techniques={["Pattern", "Copy-Paste", "Timing"]}
              />
              <ModuleCard
                title="Explainable AI"
                description="SHAP-style decision transparency"
                icon={<Cpu className="w-4 h-4 text-primary" />}
                status="active"
                techniques={["SHAP", "Weighted", "XAI"]}
              />
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Index;
