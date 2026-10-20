import { CustomQueue } from "../data_structures/custom_queue";
import { DomainValidationException } from "../exceptions/domain_validation_exception";

export interface AdminGatekeeperStatus {
  required_clicks: number;
  registered_clicks: number;
  remaining_clicks: number;
  is_unlocked: boolean;
  window_duration_in_ms: number;
}

export interface AdminGatekeeperInteractionResult extends AdminGatekeeperStatus {
  should_redirect: boolean;
  redirect_path: string | null;
}

export class DiscreteAdminGatekeeper {
  private static readonly click_threshold = 5;
  private static readonly interaction_window_in_ms = 3000;
  private static readonly hidden_route = "/vesuviana_vault_login";

  private readonly recent_interactions: CustomQueue<number>;
  private access_unlocked: boolean;
  private redirect_issued: boolean;
  private last_interaction_timestamp: number | null;

  constructor() {
    this.recent_interactions = new CustomQueue<number>();
    this.access_unlocked = false;
    this.redirect_issued = false;
    this.last_interaction_timestamp = null;
  }

  get required_clicks(): number {
    return DiscreteAdminGatekeeper.click_threshold;
  }

  get window_duration_in_ms(): number {
    return DiscreteAdminGatekeeper.interaction_window_in_ms;
  }

  get vault_route(): string {
    return DiscreteAdminGatekeeper.hidden_route;
  }

  get is_unlocked(): boolean {
    return this.access_unlocked;
  }

  register_discrete_interaction(current_timestamp_in_ms: number): AdminGatekeeperInteractionResult {
    this.validate_timestamp(current_timestamp_in_ms);
    if (this.access_unlocked) {
      return this.build_result(false);
    }
    this.recent_interactions.enqueue(current_timestamp_in_ms);
    this.last_interaction_timestamp = current_timestamp_in_ms;
    this.discard_expired_interactions(current_timestamp_in_ms);
    if (this.recent_interactions.size >= DiscreteAdminGatekeeper.click_threshold) {
      this.access_unlocked = true;
    }
    const should_redirect = this.access_unlocked && !this.redirect_issued;
    if (should_redirect) {
      this.redirect_issued = true;
    }
    return this.build_result(should_redirect);
  }

  get_access_status(): AdminGatekeeperStatus {
    return {
      required_clicks: this.required_clicks,
      registered_clicks: Math.min(
        this.recent_interactions.size,
        DiscreteAdminGatekeeper.click_threshold,
      ),
      remaining_clicks: Math.max(
        DiscreteAdminGatekeeper.click_threshold - this.recent_interactions.size,
        0,
      ),
      is_unlocked: this.access_unlocked,
      window_duration_in_ms: this.window_duration_in_ms,
    };
  }

  revoke_access(): void {
    this.recent_interactions.clear();
    this.access_unlocked = false;
    this.redirect_issued = false;
    this.last_interaction_timestamp = null;
  }

  private discard_expired_interactions(current_timestamp_in_ms: number): void {
    while (!this.recent_interactions.is_empty) {
      const oldest_timestamp = this.recent_interactions.peek();
      if (current_timestamp_in_ms - oldest_timestamp >= DiscreteAdminGatekeeper.interaction_window_in_ms) {
        this.recent_interactions.dequeue();
      } else {
        break;
      }
    }
  }

  private build_result(should_redirect: boolean): AdminGatekeeperInteractionResult {
    return {
      ...this.get_access_status(),
      should_redirect,
      redirect_path: should_redirect ? this.vault_route : null,
    };
  }

  private validate_timestamp(current_timestamp_in_ms: number): void {
    if (
      typeof current_timestamp_in_ms !== "number" ||
      !Number.isFinite(current_timestamp_in_ms) ||
      current_timestamp_in_ms < 0
    ) {
      throw new DomainValidationException(
        "current_timestamp_in_ms",
        "current_timestamp_in_ms must be a finite non-negative number",
        current_timestamp_in_ms,
      );
    }
    if (
      this.last_interaction_timestamp !== null &&
      current_timestamp_in_ms < this.last_interaction_timestamp
    ) {
      throw new DomainValidationException(
        "current_timestamp_in_ms",
        "current_timestamp_in_ms cannot move backwards",
        current_timestamp_in_ms,
      );
    }
  }
}
