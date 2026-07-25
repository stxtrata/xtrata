import { mountPage } from '../../shell/mount';
import { CanaryApp } from './CanaryApp';

/**
 * Deployment Canary entry — the 15-stage gated deployment pipeline
 * (architecture §9, threats 13/15/16).
 */
mountPage(<CanaryApp />);
