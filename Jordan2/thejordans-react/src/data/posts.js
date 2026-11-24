/*
 * News articles (the /news page and /news/<slug>). The slugs match the links
 * on the home page's "Insights" cards. Edit the text here.
 */
const IMG = (name) => `/uploads/2026/02/${name}.webp`;

export const POSTS = [
  {
    slug: 'future-trends-in-e-commerce-fulfillment',
    title: 'Future Trends in E-Commerce Fulfillment',
    date: '2026-02-25',
    tags: ['Green Logistics', 'Logistics'],
    image: IMG('p9'),
    excerpt: 'Faster delivery promises, smarter warehouses and greener last miles are reshaping how online orders reach customers.',
    body: [
      'Online shoppers now expect next-day delivery as standard, live tracking on every order and easy returns. Meeting those expectations at scale means rethinking fulfillment from the warehouse shelf to the doorstep.',
      'Regional fulfillment hubs place stock closer to customers, cutting transit times and costs. Combined with automated picking and real-time inventory data, businesses can promise accurate delivery windows and keep them.',
      'Sustainability is becoming a deciding factor too. Consolidated loads, optimised routes and lower-emission vehicles reduce the footprint of every parcel — and customers increasingly choose brands that deliver responsibly.',
      'At WorldBridgeXpress we combine these approaches so growing e-commerce brands get fast, trackable and responsible delivery without building their own logistics network.',
    ],
  },
  {
    slug: 'urban-vs-regional-delivery-strategies',
    title: 'Urban vs Regional Delivery Strategies',
    date: '2026-02-25',
    tags: ['Logistics'],
    image: IMG('p8'),
    excerpt: 'Dense city routes and long regional runs need different playbooks. Here is how we plan for both.',
    body: [
      'Urban deliveries are short in distance but long in time: traffic, parking and access restrictions decide how many stops a driver can make. Smaller vehicles, micro-hubs and tight time windows keep city routes efficient.',
      'Regional deliveries are the opposite — long distances between fewer stops. Here, load consolidation, line-haul scheduling and reliable hand-overs between depots matter most.',
      'The best results come from treating them as one network. Freight moves in full loads between regions, then splits into optimised city rounds close to the customer.',
      'Our planners balance both every day, so a shipment crossing the country arrives with the same predictability as one going across town.',
    ],
  },
  {
    slug: 'solving-last-mile-delivery-challenges-2',
    title: 'Solving Last-Mile Delivery Challenges',
    date: '2026-02-25',
    tags: ['Smart Routing'],
    image: IMG('p6'),
    excerpt: 'The last mile is the most expensive part of any delivery. Smart routing makes it faster and cheaper.',
    body: [
      'The final leg of a delivery can account for more than half of its total cost. Failed attempts, inefficient routes and missed time windows quickly add up.',
      'Smart routing uses live traffic, delivery windows and vehicle capacity to build the shortest practical route for every driver — and re-plans when conditions change during the day.',
      'Clear communication closes the gap: customers who receive accurate arrival times and a live tracking link are far more likely to be home, which means fewer second attempts.',
      'Every WorldBridgeXpress shipment comes with live map tracking and status updates by email, so receivers always know when to expect their package.',
    ],
  },
  {
    slug: 'the-role-of-technology-in-optimizing-fulfillment-operations',
    title: 'The Role of Technology in Optimizing Fulfillment Operations',
    date: '2026-02-25',
    tags: ['Customer Experience'],
    image: IMG('p4'),
    excerpt: 'From barcode scans to live maps, technology turns fulfillment into a process you can see and improve.',
    body: [
      'Every scan, hand-over and status change creates data. When that data is captured in real time, operations teams can spot delays early and act before customers notice.',
      'Warehouse systems direct pickers along the shortest path, label printers produce accurate shipping documents, and tracking platforms share each checkpoint with the customer instantly.',
      'The result is a better experience on both sides: fewer errors and lower costs for the business, and full visibility for the person waiting for the parcel.',
      'Our tracking page shows each WorldBridgeXpress shipment live on the map, with its full history, current status and estimated arrival.',
    ],
  },
  {
    slug: 'solving-last-mile-delivery-challenges',
    title: 'Solving Last-Mile Delivery Challenges',
    date: '2026-02-25',
    tags: ['Sustainability'],
    image: IMG('p5'),
    excerpt: 'Greener last-mile delivery is possible without slowing anything down.',
    body: [
      'Last-mile delivery produces a large share of a parcel’s emissions because vehicles stop and start constantly, often half-empty.',
      'Consolidating deliveries by area, using pick-up points and planning routes around fewer, fuller trips all reduce fuel use — and usually cost as well.',
      'Customers play a part too. Clear delivery options, such as choosing a safe place or a neighbour, avoid repeat trips for missed deliveries.',
      'WorldBridgeXpress plans routes to keep vehicles full and journeys short, because the most sustainable delivery is the one that succeeds the first time.',
    ],
  },
  {
    slug: 'what-customers-expect-from-fast-delivery-today-2',
    title: 'What Customers Expect From Fast Delivery Today',
    date: '2026-02-25',
    tags: ['Transports'],
    image: IMG('p2'),
    excerpt: 'Speed matters, but customers value reliability and transparency even more.',
    body: [
      'Fast delivery is no longer a bonus — it is the baseline. But surveys consistently show that customers care even more about receiving their order when promised.',
      'Transparency builds that trust: a tracking number straight away, updates at every stage and a realistic arrival estimate that does not keep moving.',
      'When something does go wrong, a quick, honest update and an easy way to reach support make the difference between a lost customer and a loyal one.',
      'That is why every WorldBridgeXpress shipment gets a tracking number, live map tracking and automatic email updates for both the sender and the receiver.',
    ],
  },
];

export const findPost = (slug) => POSTS.find((p) => p.slug === slug);

export const formatPostDate = (iso) =>
  new Date(iso + 'T00:00:00').toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
