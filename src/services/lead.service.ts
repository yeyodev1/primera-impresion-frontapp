import APIBase from './httpBase'
import type { LeadPayload } from '@/types'

class LeadService extends APIBase {
  async create(payload: LeadPayload): Promise<{ ok: true }> {
    const { data } = await this.post<{ ok: true }>('leads', payload)
    return data
  }
}

export const leadService = new LeadService()
