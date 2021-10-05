import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyResultModel } from '@/domain/useCases/survey-result/save-survey-result'

export interface SaveSurveyResultRepository {
  save: (surveyResult: SaveSurveyResultModel) => Promise<SurveyResultModel>
}
