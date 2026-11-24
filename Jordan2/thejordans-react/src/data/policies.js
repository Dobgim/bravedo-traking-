/*
 * Website policies (the /policies page). Each policy has an id (used in links
 * like /policies#pet-crate-rental), a title and sections. Section blocks:
 *   { p: 'text' }            paragraph
 *   { ol: [[title, text]] }  numbered items (text optional)
 *   { ul: ['text'] }         bullet list
 * Edit the wording here.
 */
export const POLICIES = [
  {
    id: 'shipping-fees-refund',
    title: 'Shipping Fees and Refund Policy',
    short: 'Shipping Fees & Refunds',
    notice: 'Important Notice to All Customers',
    intro:
      'Our company is committed to providing transparent shipping services and ensuring that customers understand all charges associated with their shipments.',
    sections: [
      {
        title: 'Additional Services and Charges',
        blocks: [
          { p: 'Depending on the nature and destination of a shipment, certain additional services or charges may apply. These may include:' },
          {
            ol: [
              ['Shipping Stamps and Documentation', 'Applicable postage, shipping stamps, and required shipment documentation.'],
              ['Shipping Insurance', 'Insurance coverage selected or required under the applicable shipping agreement.'],
              ['Account Setup Services', ''],
            ],
          },
        ],
      },
      {
        title: 'Fee Disclosure and Payment',
        blocks: [
          { p: 'Any applicable fees will be communicated to the customer individually before payment is requested.' },
          { p: 'Customers will receive an itemized breakdown showing the purpose, amount, payment recipient, and applicable terms of each charge.' },
        ],
      },
      {
        title: 'Refund Policy',
        blocks: [
          { p: 'Any payment expressly identified as a refundable deposit will be refunded according to the agreed refund terms.' },
          {
            p: 'Where a refundable deposit is subject to successful delivery, the refund will be initiated following confirmation of delivery, within the stated processing period.',
          },
          { p: 'Non-refundable charges, including services already provided and third-party expenses, will be clearly identified before payment.' },
        ],
      },
      {
        title: 'Customer Assurance',
        blocks: [
          {
            p: 'We encourage all customers to retain their payment receipts and shipment references. Our customer service department is available to clarify any charges and provide information about applicable refunds.',
          },
          { p: 'Transparency, accountability, and customer confidence remain our priorities.', strong: true },
        ],
      },
    ],
  },
  {
    id: 'pet-crate-rental',
    title: 'Pet Shipping Crate Rental and Refund Policy',
    short: 'Pet Crate Rental & Refunds',
    notice: 'Important Notice to All Customers',
    intro:
      'For the safety, comfort, and proper transportation of animals, all pets travelling through our shipping service must be accommodated in an appropriate, airline-approved pet shipping crate.',
    sections: [
      {
        title: '1. Mandatory Shipping Crate Requirement',
        blocks: [
          {
            p: 'Every pet must have a suitable shipping crate that meets the applicable airline and animal transportation requirements. This is necessary to ensure the pet’s safety and compliance throughout the transportation process.',
          },
        ],
      },
      {
        title: '2. Shipping Crate Rental',
        blocks: [
          {
            p: 'Our company provides shipping crates through a rental arrangement. Customers are required to pay the applicable refundable crate rental deposit before the transportation process can proceed.',
          },
          { p: 'The crate is provided specifically for the duration of the pet’s transportation.' },
        ],
      },
      {
        title: '3. Refund Policy',
        blocks: [
          { p: 'The crate rental deposit is refundable upon successful delivery of the pet to the designated recipient.' },
          { p: 'Once delivery has been confirmed, the company will initiate the refund according to the agreed refund processing terms.' },
        ],
      },
      {
        title: '4. Important Customer Notice',
        blocks: [
          {
            ul: [
              'Shipping crates are required for all applicable pet shipments.',
              'Crate rental charges and deposit terms will be disclosed before payment.',
              'The rental deposit is refundable under the stated conditions.',
              'Customers will receive confirmation of the applicable payment and refund arrangements.',
            ],
          },
        ],
      },
      {
        title: 'Our Commitment',
        blocks: [
          {
            p: 'Your pet’s safety, comfort, and well-being are our priority. Our transportation procedures are designed to ensure that every animal receives appropriate care throughout its journey.',
            strong: true,
          },
        ],
      },
    ],
  },
];
