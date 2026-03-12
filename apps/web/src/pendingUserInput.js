function normalizeDraftAnswer(value) {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}
export function resolvePendingUserInputAnswer(draft) {
  const customAnswer = normalizeDraftAnswer(draft?.customAnswer);
  if (customAnswer) {
    return customAnswer;
  }
  return normalizeDraftAnswer(draft?.selectedOptionLabel);
}
export function setPendingUserInputCustomAnswer(draft, customAnswer) {
  const selectedOptionLabel =
    customAnswer.trim().length > 0 ? undefined : draft?.selectedOptionLabel;
  return {
    customAnswer,
    ...(selectedOptionLabel ? { selectedOptionLabel } : {}),
  };
}
export function buildPendingUserInputAnswers(questions, draftAnswers) {
  const answers = {};
  for (const question of questions) {
    const answer = resolvePendingUserInputAnswer(draftAnswers[question.id]);
    if (!answer) {
      return null;
    }
    answers[question.id] = answer;
  }
  return answers;
}
export function countAnsweredPendingUserInputQuestions(questions, draftAnswers) {
  return questions.reduce((count, question) => {
    return resolvePendingUserInputAnswer(draftAnswers[question.id]) ? count + 1 : count;
  }, 0);
}
export function findFirstUnansweredPendingUserInputQuestionIndex(questions, draftAnswers) {
  const unansweredIndex = questions.findIndex(
    (question) => !resolvePendingUserInputAnswer(draftAnswers[question.id]),
  );
  return unansweredIndex === -1 ? Math.max(questions.length - 1, 0) : unansweredIndex;
}
export function derivePendingUserInputProgress(questions, draftAnswers, questionIndex) {
  const normalizedQuestionIndex =
    questions.length === 0 ? 0 : Math.max(0, Math.min(questionIndex, questions.length - 1));
  const activeQuestion = questions[normalizedQuestionIndex] ?? null;
  const activeDraft = activeQuestion ? draftAnswers[activeQuestion.id] : undefined;
  const resolvedAnswer = resolvePendingUserInputAnswer(activeDraft);
  const customAnswer = activeDraft?.customAnswer ?? "";
  const answeredQuestionCount = countAnsweredPendingUserInputQuestions(questions, draftAnswers);
  const isLastQuestion =
    questions.length === 0 ? true : normalizedQuestionIndex >= questions.length - 1;
  return {
    questionIndex: normalizedQuestionIndex,
    activeQuestion,
    activeDraft,
    selectedOptionLabel: activeDraft?.selectedOptionLabel,
    customAnswer,
    resolvedAnswer,
    usingCustomAnswer: customAnswer.trim().length > 0,
    answeredQuestionCount,
    isLastQuestion,
    isComplete: buildPendingUserInputAnswers(questions, draftAnswers) !== null,
    canAdvance: Boolean(resolvedAnswer),
  };
}
