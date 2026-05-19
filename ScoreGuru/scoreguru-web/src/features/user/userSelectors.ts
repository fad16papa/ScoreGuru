import { scoreGuruApi } from '../../services/scoreGuruApi'

export const selectAuthMeResult = scoreGuruApi.endpoints.getAuthMe.select()
