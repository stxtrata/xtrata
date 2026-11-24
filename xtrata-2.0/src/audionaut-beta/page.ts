// Community Beta is intentionally public. The original and Beta Pro continue
// to use their own membership-gated hosts. Never request a wallet or session here.
const studio = document.querySelector<HTMLIFrameElement>('#daw');
if (studio && !studio.getAttribute('src')) {
  studio.src = '/audionaut-beta/daw.html';
}
export {};
