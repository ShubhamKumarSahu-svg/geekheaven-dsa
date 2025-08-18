'use client';

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/context/AuthContext';
import { Bookmark } from 'lucide-react';
import { DifficultyTag } from './DifficultyTag';

const QuestionItem = ({ question }) => {
  const {
    isAuthenticated,
    user,
    toggleQuestionProgress,
    toggleQuestionBookmark,
  } = useAuth();

  const isCompleted =
    user?.completedQuestions?.some((q) => q._id === question._id) ?? false;
  const isBookmarked =
    user?.bookmarkedQuestions?.some((q) => q._id === question._id) ?? false;

  const handleCheckboxClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleQuestionProgress(question._id);
  };

  const handleBookmarkClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleQuestionBookmark(question._id);
  };

  return (
    <AccordionItem value={question._id} className="border-b">
      <AccordionTrigger className="flex items-center justify-between gap-4 p-4 rounded-lg transition-colors duration-200 hover:bg-muted/70 hover:no-underline">
        <div className="flex items-center gap-4 flex-grow">
          {isAuthenticated && (
            <div
              onClick={handleCheckboxClick}
              className="flex items-center h-full cursor-pointer"
            >
              <Checkbox checked={isCompleted} />
            </div>
          )}
          <span className="text-card-foreground text-base md:text-lg text-left">
            {question.title}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <DifficultyTag difficulty={question.difficulty} />
          {isAuthenticated && (
            <button
              onClick={handleBookmarkClick}
              title="Toggle Bookmark"
              className="rounded-full p-1"
            >
              <Bookmark
                className={`w-5 h-5 transition-all ${
                  isBookmarked
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-muted-foreground group-hover:text-foreground'
                }`}
              />
            </button>
          )}
        </div>
      </AccordionTrigger>

      <AccordionContent className="px-6 pb-4 pt-2">
        {question.url && question.url.length > 0 ? (
          <div className="flex flex-col gap-2">
            {question.url.map((link, i) => (
              <Button
                asChild
                key={i}
                variant="outline"
                className="justify-start h-8 px-2 text-sm"
              >
                <a href={link} target="_blank" rel="noopener noreferrer">
                  Open Link {i + 1}
                </a>
              </Button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No links available.</p>
        )}
      </AccordionContent>
    </AccordionItem>
  );
};

export default QuestionItem;
