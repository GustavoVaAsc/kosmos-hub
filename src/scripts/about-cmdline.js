// About-me cmdline interactivity.
//
// The Neovim code window in the hero has a single-line cmdline at the
// bottom. We attach an invisible input over it so the user can type
// into the existing visual: the text echoes into a sibling span and
// the blinking block cursor stays in place. Enter executes one of a
// few pseudo-commands; this is decorative, not a real shell.
//
// `whoami` → echoes a fixed identity line.
// `clear`  → clears the cmdline.
// Anything else → the typed text was already echoed as the user typed,
// so we leave the input untouched and let them continue.

const input = document.getElementById('cmdline-input');
const text = document.getElementById('cmdline-text');

if (input && text) {
    const sync = () => {
        text.textContent = input.value;
    };

    input.addEventListener('input', sync);

    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const cmd = input.value.trim().toLowerCase();
            if (cmd === 'whoami') {
                input.value = 'gustavo — competitive programmer · CPCFI';
            } else if (cmd === 'clear') {
                input.value = '';
            }
            sync();
        }
    });
}