import { SurveyModel } from '@/presentation/controllers/survey/load-survey/load-surveys-controller-protocols'

export type SaveSurveyResultModel = Omit<SurveyModel, 'id'>

export interface SaveSurveyResult {
  save: (data: SaveSurveyResultModel) => Promise<void>
}
