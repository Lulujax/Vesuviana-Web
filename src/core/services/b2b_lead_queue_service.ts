import { CustomQueue } from "../data_structures/custom_queue";
import { B2BLead, B2BLeadRecord, B2BLeadSeed } from "../entities/b2b_lead";
import { DuplicateResourceException } from "../exceptions/duplicate_resource_exception";
import { ResourceNotFoundException } from "../exceptions/resource_not_found_exception";

export type B2BLeadSubmission = Omit<B2BLeadSeed, "lead_id" | "created_at">;

export class B2BLeadQueueService {
  private readonly lead_queue: CustomQueue<B2BLead>;
  private lead_sequence: number;

  constructor() {
    this.lead_queue = new CustomQueue<B2BLead>();
    this.lead_sequence = 0;
  }

  get pending_count(): number {
    return this.lead_queue.size;
  }

  submit_lead(submission: B2BLeadSubmission): B2BLeadRecord {
    const duplicate_lead = this.lead_queue.find(
      (lead) =>
        lead.email === submission.email.trim().toLowerCase() &&
        lead.intent === submission.intent &&
        lead.product_sku === (submission.product_sku ?? null),
    );
    if (duplicate_lead !== undefined) {
      throw new DuplicateResourceException("B2BLead", submission.email);
    }
    this.lead_sequence += 1;
    const timestamp = new Date();
    const lead = new B2BLead({
      ...submission,
      lead_id: this.build_lead_identifier(timestamp, this.lead_sequence),
      created_at: timestamp.toISOString(),
    });
    this.lead_queue.enqueue(lead);
    return lead.to_plain_record();
  }

  next_lead(): B2BLead {
    if (this.lead_queue.is_empty) {
      throw new ResourceNotFoundException("B2BLead", "next");
    }
    return this.lead_queue.dequeue();
  }

  peek_next_lead(): B2BLead | undefined {
    return this.lead_queue.is_empty ? undefined : this.lead_queue.peek();
  }

  get_pending_leads(): B2BLead[] {
    return this.lead_queue.to_array();
  }

  get_pending_records(): B2BLeadRecord[] {
    return this.lead_queue.map((lead) => lead.to_plain_record());
  }

  get_leads_by_advisor(advisor_id: string): B2BLead[] {
    return this.lead_queue.to_array().filter((lead) => lead.advisor_id === advisor_id);
  }

  get_leads_by_product(product_sku: string): B2BLead[] {
    return this.lead_queue.to_array().filter((lead) => lead.product_sku === product_sku);
  }

  drain_leads(): B2BLead[] {
    return this.lead_queue.drain();
  }

  clear(): void {
    this.lead_queue.clear();
  }

  private build_lead_identifier(timestamp: Date, sequence_number: number): string {
    const compact_timestamp = timestamp.toISOString().replace(/\D/g, "").slice(0, 14);
    return `LEAD-${compact_timestamp}-${sequence_number.toString().padStart(4, "0")}`;
  }
}
