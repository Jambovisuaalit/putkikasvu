/**
 * PutkiKasvu Standard — first-payment state transitions.
 * No customer data or secrets are stored in this module.
 * Payment confirmation must come from an independently verified Revolut Pro transaction.
 */
export const STANDARD = Object.freeze({
  name: 'PutkiKasvu Standard',
  totalCents: 59000,
  depositCents: 29500,
  finalCents: 29500,
  currency: 'EUR',
  depositCheckoutUrl: 'https://checkout.revolut.com/pay/595062b8-6377-4e8d-bb80-fd53ecced9c9'
});

function nonEmpty(value) {
  return typeof value === 'string' && value.trim().length > 0;
}
function validEmail(value) {
  return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
function hasExplicitAcceptance(order) {
  return order?.status === 'ACCEPTED'
    && order?.buyerAuthorized === true
    && order?.offerAccepted === true
    && order?.termsAccepted === true
    && nonEmpty(order?.acceptanceEvidence)
    && nonEmpty(order?.termsVersion)
    && nonEmpty(order?.offerNumber)
    && nonEmpty(order?.orderNumber)
    && nonEmpty(order?.buyerBusinessId)
    && nonEmpty(order?.buyerCompany)
    && nonEmpty(order?.representativeName)
    && validEmail(order?.buyerEmail)
    && nonEmpty(order?.deliveryScope)
    && nonEmpty(order?.deliverySchedule);
}

/**
 * Creates a DRAFT message only. Sending it requires a separate permitted action.
 * The checkout is deliberately absent from public landing pages and cold outreach.
 */
export function buildDepositRequest(order) {
  if (!hasExplicitAcceptance(order)) {
    throw new Error('Cannot request deposit without recorded explicit buyer acceptance and complete order details.');
  }
  if (order.totalCents !== STANDARD.totalCents || order.currency !== STANDARD.currency) {
    throw new Error('Order amount or currency differs from the approved Standard offer.');
  }
  const subject = `Tilausvahvistus ${order.orderNumber} – ${STANDARD.name}, ennakkomaksu 295 €`;
  const text = [
    `Hei ${order.representativeName},`,
    '',
    `Olette hyväksyneet PutkiKasvu Standard -tarjouksen ${order.offerNumber} yritykselle ${order.buyerCompany} (${order.buyerBusinessId}).`,
    'Kokonaishinta on 590 €. Ensimmäinen maksuerä on 295 € ja jälkimmäinen 295 € hyväksytyn julkaisuvalmiin toteutuksen jälkeen ennen julkaisua.',
    `Toimituksen rajaus: ${order.deliveryScope}`,
    `Aikataulu: ${order.deliverySchedule}`,
    `Hyväksytyt ehdot: ${order.termsVersion}.`,
    '',
    '295 € ennakkomaksu Revolut Pro -maksulinkillä:',
    STANDARD.depositCheckoutUrl,
    '',
    `Kirjoittakaa maksusivun yrityksen nimikenttään: ${order.buyerCompany}.`,
    'Maksun kirjaaminen vahvistetaan erikseen Revolut Pro -tapahtuman perusteella. Maksulinkin avaaminen ei ole maksutosite.',
    '',
    'PutkiKasvu',
    'jami@putkikasvu.fi'
  ].join('\n');
  return Object.freeze({
    orderNumber: order.orderNumber,
    to: order.buyerEmail,
    subject,
    text,
    amountCents: STANDARD.depositCents,
    currency: STANDARD.currency,
    paymentLink: STANDARD.depositCheckoutUrl,
    nextStatus: 'DEPOSIT_REQUESTED'
  });
}

/**
 * This does not query Revolut. The caller must pass a verified owner-side record.
 * A customer screenshot or an email is not an acceptable settlement record.
 */
export function confirmDeposit(order, transaction, alreadyUsedTransactionIds = []) {
  if (order?.status !== 'DEPOSIT_REQUESTED') throw new Error('Order is not awaiting a deposit.');
  if (transaction?.source !== 'REVOLUT_PRO_OWNER_VERIFIED' || transaction?.status !== 'COMPLETED') {
    throw new Error('Trusted, completed Revolut Pro payment evidence is required.');
  }
  if (transaction?.orderNumber !== order.orderNumber) throw new Error('Transaction is not matched to this order.');
  if (transaction?.amountCents !== STANDARD.depositCents || transaction?.currency !== STANDARD.currency) {
    throw new Error('Incorrect deposit amount or currency.');
  }
  if (!nonEmpty(transaction?.transactionId) || alreadyUsedTransactionIds.includes(transaction.transactionId)) {
    throw new Error('Missing or already used payment transaction ID.');
  }
  return Object.freeze({
    orderNumber: order.orderNumber,
    status: 'DEPOSIT_PAID',
    verifiedPaymentId: transaction.transactionId,
    verifiedAmountCents: STANDARD.depositCents,
    currency: STANDARD.currency
  });
}
