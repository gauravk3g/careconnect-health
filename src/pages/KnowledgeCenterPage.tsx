/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Clock,
  Bookmark,
  BookmarkCheck,
  ChevronRight,
  X,
  Share2,
  ThumbsUp,
  Sparkles,
  Info,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { api } from '../services/api.js';
import { HealthArticle } from '../types/index.js';

interface KnowledgeCenterPageProps {
  savedArticleIds: string[];
  onToggleSaveArticle: (articleId: string) => void;
  onNavigateToAssistant?: (prompt: string) => void;
}

export const KnowledgeCenterPage: React.FC<KnowledgeCenterPageProps> = ({
  savedArticleIds,
  onToggleSaveArticle,
  onNavigateToAssistant,
}) => {
  const [articles, setArticles] = useState<HealthArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [readingArticle, setReadingArticle] = useState<HealthArticle | null>(null);
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  const categories = [
    'All',
    'Appointment Prep',
    'Medical Terminology',
    'Discharge Paperwork',
    'Preventive Care',
    'Wellness',
    'Patient Communication',
  ];

  useEffect(() => {
    let isMounted = true;
    async function loadArticles() {
      setLoading(true);
      try {
        const res = await api.getArticles({
          search: searchQuery,
          category: selectedCategory === 'All' ? undefined : selectedCategory,
        });
        if (isMounted) {
          setArticles(res);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to load articles:', err);
        if (isMounted) setLoading(false);
      }
    }
    loadArticles();
    return () => {
      isMounted = false;
    };
  }, [searchQuery, selectedCategory]);

  const handleFeedback = async (articleId: string) => {
    setFeedbackGiven(true);
    try {
      await api.submitFeedback({
        targetType: 'article',
        targetId: articleId,
        rating: 'helpful',
      });
    } catch (err) {
      console.warn('Feedback could not be recorded:', err);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-150">
      {/* Header Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/20 shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Health Knowledge Center
                </h1>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  Patient Education
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Explore guides written in simple language to help you prepare for clinic visits, decode terminology, and stay informed.
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-400 sm:text-right">
            <span>{articles.length} Educational Guides</span>
            <span className="block text-[11px] text-amber-700 font-medium mt-0.5">
              {savedArticleIds.length} Saved for Offline Reference
            </span>
          </div>
        </div>

        {/* Search & Category Pills */}
        <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides by title, keyword, or tag..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
            />
          </div>

          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading educational library...</div>
      ) : articles.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="font-bold text-slate-700 text-sm">No Articles Found</p>
          <p className="text-xs text-slate-500">
            No educational guides matched your query. Try resetting filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {articles.map((art) => {
            const isSaved = savedArticleIds.includes(art.id);
            return (
              <div
                key={art.id}
                className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-amber-300 transition-all flex flex-col justify-between text-left group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/80">
                      {art.category}
                    </span>
                    <button
                      onClick={() => onToggleSaveArticle(art.id)}
                      className="p-1.5 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-amber-600 cursor-pointer"
                      title={isSaved ? 'Remove from saved' : 'Save article'}
                    >
                      {isSaved ? (
                        <BookmarkCheck className="w-4 h-4 text-amber-600" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <h3
                    onClick={() => setReadingArticle(art)}
                    className="text-base font-bold text-slate-900 group-hover:text-amber-700 transition-colors cursor-pointer line-clamp-2"
                  >
                    {art.title}
                  </h3>

                  <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                    {art.shortDescription}
                  </p>

                  <div className="mt-4 flex items-center gap-3 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{art.readingTimeMinutes} min read</span>
                    </span>
                    <span>•</span>
                    <span>{art.publishedDate}</span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-amber-700">
                  <button
                    onClick={() => setReadingArticle(art)}
                    className="hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Read Full Guide</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full Article Modal */}
      {readingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 animate-in fade-in zoom-in duration-150 max-h-[90vh] overflow-y-auto">
            {/* Modal header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  {readingArticle.category}
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight pt-1">
                  {readingArticle.title}
                </h2>
                <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
                  <span>By {readingArticle.author}</span>
                  <span>•</span>
                  <span>{readingArticle.readingTimeMinutes} min read</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setReadingArticle(null);
                  setFeedbackGiven(false);
                }}
                aria-label="Close article view"
                className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Key Takeaways Box */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
              <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Key Patient Takeaways</span>
              </h4>
              <ul className="space-y-1.5">
                {readingArticle.keyTakeaways.map((takeaway, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Markdown Body Content */}
            <div className="prose prose-sm prose-slate max-w-none text-slate-700 leading-relaxed space-y-4">
              {readingArticle.contentMarkdown
                .split('\n\n')
                .map((paragraph, idx) => {
                  if (paragraph.startsWith('## ')) {
                    return (
                      <h3 key={idx} className="text-base font-bold text-slate-900 pt-2">
                        {paragraph.replace('## ', '')}
                      </h3>
                    );
                  }
                  if (paragraph.startsWith('### ')) {
                    return (
                      <h4 key={idx} className="text-sm font-bold text-slate-800 pt-1">
                        {paragraph.replace('### ', '')}
                      </h4>
                    );
                  }
                  if (paragraph.startsWith('---')) {
                    return <hr key={idx} className="border-slate-200 my-4" />;
                  }
                  return (
                    <p key={idx} className="text-xs sm:text-sm leading-relaxed text-slate-700">
                      {paragraph}
                    </p>
                  );
                })}
            </div>

            {/* Article Feedback & Actions */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-medium">Was this guide helpful?</span>
                <button
                  onClick={() => handleFeedback(readingArticle.id)}
                  disabled={feedbackGiven}
                  className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-colors cursor-pointer ${
                    feedbackGiven
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-bold'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{feedbackGiven ? 'Thank you!' : 'Yes, helpful'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggleSaveArticle(readingArticle.id)}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 font-medium cursor-pointer"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{savedArticleIds.includes(readingArticle.id) ? 'Saved' : 'Save Guide'}</span>
                </button>
                <button
                  onClick={() => {
                    setReadingArticle(null);
                    setFeedbackGiven(false);
                  }}
                  className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
