import { IPaymentProvider, CanonicalPaymentRequest, CanonicalPaymentResponse } 
  from "../../interfaces/IPaymentAdaptor";

export class BoaPaymentAdaptor implements IPaymentProvider {
  async init(tenantId: string, tenantConfig: Record<string, any>) {
    // setup client with tenant secrets
  }

  async makePayment(req: CanonicalPaymentRequest): Promise<CanonicalPaymentResponse> {
    // map -> Chase API -> map back
    return { id: "chase-123", status: "PENDING" };
  }

  async getPaymentStatus(paymentId: string): Promise<CanonicalPaymentResponse> {
    return { id: paymentId, status: "SUCCESS" };
  }
}
