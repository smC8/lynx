import { CanonicalPaymentRequest, CanonicalPaymentResponse } from "../../../providers/interfaces/IPaymentAdaptor";

export interface IPaymentsService {
  createPayment(
    tenantId: string,
    providerName: string,
    payload: CanonicalPaymentRequest
  ): Promise<CanonicalPaymentResponse>;

  getPaymentStatus(
    tenantId: string,
    providerName: string,
    paymentId: string
  ): Promise<CanonicalPaymentResponse>;
}