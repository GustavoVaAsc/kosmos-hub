// Main menu terminal interactivity.
//
// The cmdline accepts a small set of commands (`classes`, `about`,
// `blog`, `help`, `clear`). Unknown commands produce a Spanish
// "comando no encontrado" message modeled on a bash shell. Tab
// completes a unique prefix; Escape clears the input + output.
//
// The base path comes from `import.meta.env.BASE_URL`, which Vite
// inlines at build time to the configured Astro base (`/kosmos-hub`).

const input = document.getElementById('terminal-input');
const form = document.getElementById('terminal-form');
const output = document.getElementById('terminal-output');
const keyboardToggle = document.getElementById('keyboard-toggle');

const COMMANDS = {
    classes: {
        href: `${import.meta.env.BASE_URL}/club-classes`,
        desc: 'Mis clases para CPCFI',
    },
    about: {
        href: `${import.meta.env.BASE_URL}/about-me`,
        desc: 'Sobre mí',
    },
    blog: {
        href: `${import.meta.env.BASE_URL}/blog`,
        desc: 'Mi blog',
    },
};

const COMMAND_NAMES = Object.keys(COMMANDS);

function isDesktop() {
    return window.matchMedia('(min-width: 768px)').matches;
}

function appendOutput(text, isError = false) {
    if (!output) return;
    const line = document.createElement('p');
    line.className = 'terminal-output-line' + (isError ? ' error' : '');
    line.textContent = text;
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
}

function clearOutput() {
    if (output) output.replaceChildren();
}

function showHelp() {
    appendOutput('Comandos disponibles:');
    for (const [name, info] of Object.entries(COMMANDS)) {
        appendOutput(`  :${name.padEnd(8)} →  ${info.desc}`);
    }
    appendOutput("Escribe 'help' para ver esta lista o 'clear' para limpiar.");
}

function executeCommand(raw) {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;

    if (cmd === 'help') {
        showHelp();
        return;
    }

    if (cmd === 'clear') {
        clearOutput();
        return;
    }

    if (Object.prototype.hasOwnProperty.call(COMMANDS, cmd)) {
        window.location.href = COMMANDS[cmd].href;
        return;
    }

    appendOutput(
        `bash: ${raw.trim()}: comando no encontrado. Escribe 'help' para ver los comandos.`,
        true,
    );
}

if (input && form) {
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const value = input.value;
        input.value = '';
        executeCommand(value);
    });

    input.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            event.preventDefault();
            input.value = '';
            clearOutput();
        } else if (event.key === 'Tab') {
            event.preventDefault();
            const partial = input.value.trim().toLowerCase();
            const matches = COMMAND_NAMES.filter((name) => name.startsWith(partial));
            if (matches.length === 1) {
                input.value = matches[0];
            } else if (matches.length > 1) {
                appendOutput(`Hay varios: ${matches.join(', ')}`);
            }
        }
    });
}

if (keyboardToggle) {
    keyboardToggle.addEventListener('click', () => {
        const isShown = document.body.classList.toggle('show-keyboard');
        keyboardToggle.setAttribute('aria-pressed', String(isShown));
        keyboardToggle.textContent = isShown ? 'Ocultar teclado' : 'Mostrar teclado';
        if (isShown && input) {
            input.focus();
        }
    });
}

// Autofocus only on desktop to avoid the soft keyboard popping up on
// mobile. Mobile users get the touch command cards by default.
if (isDesktop() && input) {
    input.focus();
}