export interface AddSurveyModel {
  image: string
  answers: SurveyAnswer[]
}

interface SurveyAnswer {
  image: string
  answer: string
}

export interface AddSurvey {
  add: (survey: AddSurveyModel) => Promise<void>
}
