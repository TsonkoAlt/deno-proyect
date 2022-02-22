const root = document.documentElement;
const menu = document.getElementById('menu');
const darkmode = document.getElementById('darkmode');
const animation = document.getElementById('animation');
const errorElement = document.getElementById('error');
const elsWithanimations = Array.from(document.getElementsByClassName('animation'));
const Dropdowns = document.getElementsByClassName('dropdown');

const localTheme = localStorage.getItem('theme');
const localAnimation = localStorage.getItem('animation');

if (localTheme === 'dark') {
    darkmode.checked = true;
    inDarkMode();
} else if (localTheme === 'light') {
    inLightMode();
}
if (localAnimation === 'true') {
    animationOn();
} else if (localAnimation === 'false') {
    animation.checked = false;
    animationOff();
}

window.matchMedia

menu.addEventListener('click', e => {
    const { parentNode: btn } = e.target;

    btn.classList.toggle('active');
    if (btn.id === 'more') {
        document.getElementById('options').classList.remove('active');
        document.getElementById('optsbar').classList.remove('active');
        document.getElementById('navbar').classList.toggle('active');
    } else {
        document.getElementById('more').classList.remove('active');
        document.getElementById('navbar').classList.remove('active');
        document.getElementById('optsbar').classList.toggle('active');
    }

});

darkmode.addEventListener('change', () => {
    let theme;
    if (darkmode.checked) {
        inDarkMode();
        theme = 'dark';
    } else {
        inLightMode();
        theme = 'light';
    }
    localStorage.setItem('theme', theme);
});

animation.addEventListener('change', () => {
    if (animation.checked) animationOn();
    else animationOff();
    localStorage.setItem('animation', animation.checked);
});

errorElement?.addEventListener('click', evt => {
    if (evt.target instanceof HTMLButtonElement) {
        errorElement.classList.add('delete');
        if (errorElement.classList.contains('animation')) {
            setTimeout(() => {
                errorElement.parentElement.removeChild(errorElement);
            },250);
        }else {
            errorElement.parentElement.removeChild(errorElement);
        }
    }
});

for (const dd of Dropdowns) {
    dd.addEventListener('mouseover', () => dd.classList.add('active'));
    dd.addEventListener('mouseout', () => dd.classList.remove('active'));
}

function inDarkMode() {
    root.style.setProperty('--hdr-bg-color', '#6545b0');
    root.style.setProperty('--hdr-fg-color', '#c6b0cf');
    root.style.setProperty('--body-bg-color', '#15101a');
    root.style.setProperty('--sect-bg-color', '#1c1822');
    root.style.setProperty('--dropdown-bg-color', '#2a2630');
    root.style.setProperty('--body-fg-color', '#a394a3');
    root.style.setProperty('--primary-shadow', '#40305080');
    root.style.setProperty('--refbtn-active', 'brightness(120%)');
    root.style.setProperty('--filter-img', 'invert(98%) sepia(79%) saturate(3323%) hue-rotate(186deg) brightness(85%) contrast(89%)');
}
function inLightMode() {
    root.style.setProperty('--hdr-bg-color', '#a585d0');
    root.style.setProperty('--hdr-fg-color', '#542d5e');
    root.style.setProperty('--body-bg-color', '#f5f0fa');
    root.style.setProperty('--sect-bg-color', '#eeeaf5');
    root.style.setProperty('--dropdown-bg-color', '#dedae5');
    root.style.setProperty('--body-fg-color', '#534453');
    root.style.setProperty('--primary-shadow', '#50406080');
    root.style.setProperty('--refbtn-active', 'brightness(93%)');
    root.style.setProperty('--filter-img', 'invert(20%) sepia(46%) saturate(727%) hue-rotate(242deg) brightness(94%) contrast(93%)');
}
function animationOn() {
    for (const el of elsWithanimations) {
        el.classList.remove('non-animation');
        el.classList.add('animation');
    }
}
function animationOff() {
    for (const el of elsWithanimations) {
        el.classList.add('non-animation');
        el.classList.remove('animation');
    }
}