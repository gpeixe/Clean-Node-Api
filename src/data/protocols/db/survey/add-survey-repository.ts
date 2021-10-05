import { AddSurveyModel } from '@/domain/useCases/survey/add-survey'

export interface AddSurveyRepository {
  add: (survey: AddSurveyModel) => Promise<void>
}
