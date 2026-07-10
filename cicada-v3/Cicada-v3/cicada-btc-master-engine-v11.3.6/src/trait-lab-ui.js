// Dev/audition UI for temporarily overriding seeded traits without changing rarity.
import {
    TRAIT_REGISTRY,
    LAB_CONTROL_ORDER,
    valueToOptionValue,
    isExperimentalValue,
    randomExperimentalLabState
} from './trait-registry.js?v=11.3.5';

function labelFromValue(value) {
    if (value === '') return 'Official seed value';
    if (value === 'official') return 'Official / seeded';
    return String(value).replace(/-/g, ' ');
}

function defaultLabState() {
    return Object.fromEntries(LAB_CONTROL_ORDER.map(key => [key, TRAIT_REGISTRY[key].defaultValue]));
}

function defaultLockState() {
    return Object.fromEntries(LAB_CONTROL_ORDER.map(key => [key, false]));
}

function optionMarkup(key, value) {
    const trait = TRAIT_REGISTRY[key];
    const optionValue = valueToOptionValue(value);
    const experimental = isExperimentalValue(key, optionValue);
    const official = trait.official.includes(optionValue);
    const label = `${labelFromValue(optionValue)}${experimental ? '  · lab' : official && optionValue !== trait.defaultValue ? '  · official' : ''}`;
    return `<option value="${optionValue}">${label}</option>`;
}

function controlMarkup(key) {
    const trait = TRAIT_REGISTRY[key];
    const first = trait.defaultValue === '' ? ['official seed value'] : [trait.defaultValue];
    const values = Array.from(new Set([...first, ...trait.official, ...trait.experimental]));
    const options = values.map(value => optionMarkup(key, value)).join('');
    return `
        <div class="lab-field-row">
            <label class="lab-field lab-field-main">
                <span>${trait.label}</span>
                <select data-lab-control="${key}">${options}</select>
            </label>
            <button class="lab-lock-btn" data-lab-lock="${key}" type="button" aria-pressed="false" aria-label="Lock ${trait.label}">Lock</button>
        </div>
    `;
}

function summarizeState(state, locks) {
    const active = Object.entries(state).filter(([, value]) => value && value !== 'official');
    const locked = Object.entries(locks).filter(([, value]) => value).map(([key]) => TRAIT_REGISTRY[key].label);
    const lines = [];
    if (!active.length) {
        lines.push('Official seed only. No lab overrides active.');
    } else {
        lines.push(...active.map(([key, value]) => `${TRAIT_REGISTRY[key].label}: ${labelFromValue(value)}`));
    }
    lines.push('');
    lines.push(locked.length ? `Locked controls: ${locked.join(', ')}` : 'Locked controls: none');
    return lines.join('\n');
}

export function initTraitLab({ mount, onChange, getOverrideJSON } = {}) {
    const target = typeof mount === 'string' ? document.querySelector(mount) : mount;
    if (!target) throw new Error('Trait Lab mount element not found');

    let state = defaultLabState();
    let locks = defaultLockState();

    target.innerHTML = `
        <div class="trait-lab-head">
            <div>
                <h2>Trait Lab</h2>
                <p>Audition experimental cicada, palette, marking, and prime-field traits without changing official rarity. Lock any control and randomise the rest safely.</p>
            </div>
            <button id="trait-lab-toggle" type="button" aria-expanded="true">Collapse</button>
        </div>
        <div id="trait-lab-body">
            <div class="trait-lab-grid">
                ${LAB_CONTROL_ORDER.map(controlMarkup).join('')}
            </div>
            <div class="trait-lab-buttons">
                <button id="trait-lab-random" type="button">Random Unlocked</button>
                <button id="trait-lab-reset" type="button">Reset Official</button>
                <button id="trait-lab-clear-locks" type="button">Clear Locks</button>
                <button id="trait-lab-copy" type="button">Copy Override JSON</button>
            </div>
            <pre id="trait-lab-summary">Official seed only. No lab overrides active.</pre>
        </div>
    `;

    const body = target.querySelector('#trait-lab-body');
    const summary = target.querySelector('#trait-lab-summary');
    const controls = Array.from(target.querySelectorAll('[data-lab-control]'));
    const lockButtons = Array.from(target.querySelectorAll('[data-lab-lock]'));

    function syncControls() {
        for (const control of controls) {
            control.value = state[control.dataset.labControl] || '';
        }
        for (const button of lockButtons) {
            const key = button.dataset.labLock;
            const locked = Boolean(locks[key]);
            button.classList.toggle('is-locked', locked);
            button.setAttribute('aria-pressed', String(locked));
            button.textContent = locked ? 'Locked' : 'Lock';
        }
        summary.textContent = summarizeState(state, locks);
    }

    function emit() {
        syncControls();
        onChange?.({ ...state });
    }

    for (const control of controls) {
        control.addEventListener('change', () => {
            state = { ...state, [control.dataset.labControl]: control.value };
            emit();
        });
    }

    for (const button of lockButtons) {
        button.addEventListener('click', () => {
            const key = button.dataset.labLock;
            locks = { ...locks, [key]: !locks[key] };
            syncControls();
        });
    }

    target.querySelector('#trait-lab-random').addEventListener('click', () => {
        state = { ...state, ...randomExperimentalLabState(Math.random, locks) };
        emit();
    });

    target.querySelector('#trait-lab-reset').addEventListener('click', () => {
        state = defaultLabState();
        emit();
    });

    target.querySelector('#trait-lab-clear-locks').addEventListener('click', () => {
        locks = defaultLockState();
        syncControls();
    });

    target.querySelector('#trait-lab-copy').addEventListener('click', async () => {
        const json = getOverrideJSON ? getOverrideJSON(state) : JSON.stringify(state, null, 2);
        try {
            await navigator.clipboard.writeText(json);
            summary.textContent = `Copied override JSON:\n${json}`;
        } catch (_) {
            summary.textContent = `Copy failed, select manually:\n${json}`;
        }
    });

    target.querySelector('#trait-lab-toggle').addEventListener('click', event => {
        const collapsed = body.hidden = !body.hidden;
        event.currentTarget.textContent = collapsed ? 'Expand' : 'Collapse';
        event.currentTarget.setAttribute('aria-expanded', String(!collapsed));
    });

    syncControls();
    return {
        getState: () => ({ ...state }),
        setState(nextState = {}) {
            state = { ...defaultLabState(), ...nextState };
            emit();
        },
        reset() {
            state = defaultLabState();
            emit();
        },
        destroy() {
            target.replaceChildren();
        }
    };
}
