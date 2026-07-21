import {
  HOMEPAGE_ACTIVITY_DOORS,
  HOMEPAGE_CAMPAIGN_BANNERS,
  HOMEPAGE_CAMPAIGN,
  HOMEPAGE_INTENTS,
  HOMEPAGE_OBJECTS,
  validateHomepageContent
} from './homepage-content.js';

const HOME_ACTION_EVENT = 'xtrata:homepage-action';
const HOME_MOUNT_IDS = [
  'featuredObjectStage',
  'possibilityGrid',
  'intentGrid',
  'homeActivityList',
  'campaignBannerList',
  'campaignSlot'
];
let actionTrackingInstalled = false;
let contentValidated = false;

const element = (tagName, className, text) => {
  const node = document.createElement(tagName);
  if (className) {
    node.className = className;
  }
  if (text !== undefined) {
    node.textContent = text;
  }
  return node;
};

const actionLink = (href, label, className, action) => {
  const link = element('a', className, label);
  link.href = href;
  link.dataset.homeAction = action;
  if (href.startsWith('/')) {
    link.target = '_self';
  } else {
    link.target = '_blank';
    link.rel = 'noreferrer';
  }
  return link;
};

const createPreview = (preview, options = {}) => {
  const frame = element('div', `object-preview object-preview--${preview.type}`);
  const eager = options.eager === true;

  if (preview.type === 'iframe') {
    const iframe = document.createElement('iframe');
    iframe.src = preview.src;
    iframe.title = preview.title;
    iframe.loading = eager ? 'eager' : 'lazy';
    iframe.sandbox = 'allow-scripts allow-pointer-lock allow-forms allow-popups';
    iframe.allow = 'autoplay; fullscreen';
    iframe.tabIndex = options.interactive === true ? 0 : -1;
    frame.append(iframe);
  } else if (preview.type === 'image') {
    const image = document.createElement('img');
    image.src = preview.src;
    image.alt = preview.title;
    image.loading = eager ? 'eager' : 'lazy';
    image.decoding = 'async';
    frame.append(image);
  } else if (preview.type === 'claim') {
    const claim = element('div', 'claim-object');
    claim.append(
      element('span', 'claim-object__status', 'Sponsored claim'),
      element('strong', 'claim-object__price', '0 STX'),
      element('span', 'claim-object__note', 'Network fee sponsored'),
      element('span', 'claim-object__button', 'Claim free →')
    );
    frame.append(claim);
  }

  const metadata = element('span', 'object-preview__meta', preview.label);
  frame.append(metadata);
  return frame;
};

const renderHeroStage = () => {
  const mount = document.getElementById('featuredObjectStage');
  if (!mount) {
    return;
  }
  mount.replaceChildren();
  HOMEPAGE_OBJECTS.slice(0, 4).forEach((item, index) => {
    const card = element('article', `living-object living-object--${item.accent}`);
    card.dataset.objectId = item.id;
    card.append(createPreview(item.preview, { eager: index < 2, interactive: index === 0 }));
    const footer = element('div', 'living-object__footer');
    footer.append(
      element('span', 'living-object__eyebrow', item.eyebrow),
      actionLink(item.href, item.title, 'living-object__link', `hero_object:${item.id}`)
    );
    card.append(footer);
    mount.append(card);
  });
};

const renderObjects = () => {
  const mount = document.getElementById('possibilityGrid');
  if (!mount) {
    return;
  }
  mount.replaceChildren();
  HOMEPAGE_OBJECTS.forEach((item) => {
    const card = element('article', `possibility-card possibility-card--${item.accent}`);
    card.dataset.objectId = item.id;
    card.append(createPreview(item.preview, { interactive: true }));
    const body = element('div', 'possibility-card__body');
    body.append(
      element('span', 'section-kicker', item.eyebrow),
      element('h3', 'possibility-card__title', item.title),
      element('p', 'possibility-card__copy', item.description),
      actionLink(item.href, `${item.cta} →`, 'text-link', `possibility:${item.id}`)
    );
    card.append(body);
    mount.append(card);
  });
};

const renderIntents = () => {
  const mount = document.getElementById('intentGrid');
  if (!mount) {
    return;
  }
  mount.replaceChildren();
  HOMEPAGE_INTENTS.forEach((item) => {
    const card = actionLink(item.href, '', 'intent-card', `intent:${item.id}`);
    card.setAttribute('aria-label', `${item.title}: ${item.description}`);
    card.append(
      element('span', 'intent-card__number', item.number),
      element('strong', 'intent-card__title', item.title),
      element('span', 'intent-card__copy', item.description),
      element('span', 'intent-card__cta', `${item.cta} →`)
    );
    mount.append(card);
  });
};

const renderActivity = () => {
  const mount = document.getElementById('homeActivityList');
  if (!mount) {
    return;
  }
  mount.replaceChildren();
  HOMEPAGE_ACTIVITY_DOORS.forEach((item) => {
    const link = actionLink(item.href, '', 'activity-door', `activity:${item.id}`);
    const headline = element('span', 'activity-door__headline');
    headline.append(element('span', 'live-pulse'), element('strong', '', item.verb));
    link.append(
      headline,
      element('span', 'activity-door__copy', item.description),
      element('span', 'activity-door__arrow', '↗')
    );
    mount.append(link);
  });
};

const renderCampaignBanners = () => {
  const mount = document.getElementById('campaignBannerList');
  if (!mount) {
    return;
  }
  mount.replaceChildren();
  HOMEPAGE_CAMPAIGN_BANNERS.forEach((item) => {
    const banner = actionLink(
      item.href,
      '',
      `campaign-banner campaign-banner--${item.tone}`,
      `campaign_banner:${item.id}`
    );
    banner.dataset.campaignId = item.id;
    banner.dataset.campaignStatus = item.status;

    if (item.artwork) {
      const image = document.createElement('img');
      image.className = 'campaign-banner__art';
      image.src = item.artwork;
      image.alt = `${item.title} campaign artwork`;
      image.decoding = 'async';
      banner.append(image);
    } else {
      const stat = element('span', 'campaign-banner__art campaign-banner__stat');
      stat.append(
        element('strong', '', item.stat),
        element('small', '', item.statLabel)
      );
      banner.append(stat);
    }

    const body = element('span', 'campaign-banner__body');
    const kicker = element('span', 'campaign-banner__kicker');
    kicker.append(
      element('span', 'campaign-banner__pulse'),
      document.createTextNode(item.eyebrow)
    );
    body.append(
      kicker,
      element('strong', 'campaign-banner__title', item.title),
      element('span', 'campaign-banner__copy', item.description)
    );
    banner.append(
      body,
      element('span', 'campaign-banner__cta', `${item.cta} →`)
    );
    mount.append(banner);
  });
};

const renderCampaign = () => {
  const mount = document.getElementById('campaignSlot');
  if (!mount) {
    return;
  }
  mount.replaceChildren();
  mount.dataset.campaignId = HOMEPAGE_CAMPAIGN.id;
  mount.dataset.campaignStatus = HOMEPAGE_CAMPAIGN.status;

  const art = element('div', 'campaign-slot__art');
  if (HOMEPAGE_CAMPAIGN.artwork) {
    const image = document.createElement('img');
    image.src = HOMEPAGE_CAMPAIGN.artwork;
    image.alt = `${HOMEPAGE_CAMPAIGN.title} campaign artwork`;
    image.loading = 'lazy';
    art.append(image);
  } else {
    const stat = element('div', 'campaign-slot__stat');
    stat.append(
      element('span', 'campaign-slot__stat-number', HOMEPAGE_CAMPAIGN.stat),
      element('span', 'campaign-slot__stat-label', HOMEPAGE_CAMPAIGN.statLabel)
    );
    art.append(stat);
  }

  const body = element('div', 'campaign-slot__body');
  const sponsor = HOMEPAGE_CAMPAIGN.sponsor
    ? ` · with ${HOMEPAGE_CAMPAIGN.sponsor}`
    : '';
  body.append(
    element('span', 'section-kicker', `${HOMEPAGE_CAMPAIGN.eyebrow}${sponsor}`),
    element('h3', 'campaign-slot__title', HOMEPAGE_CAMPAIGN.title),
    element('p', 'campaign-slot__copy', HOMEPAGE_CAMPAIGN.description)
  );
  const actions = element('div', 'campaign-slot__actions');
  actions.append(
    actionLink(
      HOMEPAGE_CAMPAIGN.primaryAction.href,
      HOMEPAGE_CAMPAIGN.primaryAction.label,
      'btn',
      `campaign:${HOMEPAGE_CAMPAIGN.id}:primary`
    ),
    actionLink(
      HOMEPAGE_CAMPAIGN.secondaryAction.href,
      HOMEPAGE_CAMPAIGN.secondaryAction.label,
      'btn secondary',
      `campaign:${HOMEPAGE_CAMPAIGN.id}:secondary`
    )
  );
  body.append(actions);
  mount.append(art, body);
};

const installActionTracking = () => {
  if (actionTrackingInstalled) {
    return;
  }
  actionTrackingInstalled = true;
  document.addEventListener('click', (event) => {
    const origin = event.target instanceof Element ? event.target : null;
    const target = origin?.closest('[data-home-action]');
    if (!target) {
      return;
    }
    const detail = {
      action: target.dataset.homeAction,
      href: target instanceof HTMLAnchorElement ? target.href : null,
      page: 'home'
    };
    window.dispatchEvent(new CustomEvent(HOME_ACTION_EVENT, { detail }));
    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: 'xtrata_home_action', ...detail });
    }
  });
};

const clearHomepage = () => {
  HOME_MOUNT_IDS.forEach((id) => document.getElementById(id)?.replaceChildren());
};

export const initHomepage = () => {
  installActionTracking();
  if (!contentValidated) {
    contentValidated = true;
    const contentErrors = validateHomepageContent();
    if (contentErrors.length > 0) {
      console.warn('[xtrata-homepage] invalid content configuration', contentErrors);
    }
  }
  if (document.documentElement.dataset.page !== 'home') {
    // These mounts contain sandboxed live inscriptions. Removing them when a
    // different SPA page is active prevents hidden third-party frames from
    // issuing requests and polluting that page's browser diagnostics.
    clearHomepage();
    return;
  }
  renderHeroStage();
  renderObjects();
  renderIntents();
  renderActivity();
  renderCampaignBanners();
  renderCampaign();
  installActionTracking();
};

initHomepage();
const pageModeObserver = new MutationObserver(() => initHomepage());
pageModeObserver.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['data-page']
});
