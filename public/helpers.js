export function getDateMessage (_parsedTimeUnits) {
    let made_at = '';

    const years = _parsedTimeUnits.years;
    const months = _parsedTimeUnits.months;
    const days = _parsedTimeUnits.days;
    const hours = _parsedTimeUnits.hours;
    const minutes = _parsedTimeUnits.minutes;
    const seconds = _parsedTimeUnits.seconds;

    if (years > 0) {
        years === 1 ? 
            made_at = `hace ${years} año` :
            made_at = `hace ${years} años`;
    }
    else if (months > 0) {
        months === 1 ? 
            made_at = `hace ${months} mes` :
            made_at = `hace ${months} meses`;
    }
    else if (days > 0) {
        days === 1 ? 
            made_at = `hace ${days} día` :
            made_at = `hace ${days} días`;
    } else if (hours > 0) {
        hours === 1 ?
            made_at = `hace ${hours} hora` :
            made_at = `hace ${hours} horas`;
    } else if (minutes > 0) {
        minutes === 1 ?
            made_at = `hace ${minutes} minuto` :
            made_at = `hace ${minutes} minutos`; 
    } else if (seconds > 0) {
        seconds === 1 ?
            made_at = `hace ${seconds} segundo` :
            made_at = `hace ${seconds} segundos`;
    } else {
        made_at = 'ahora'
    }

    return made_at;
}

export async function loadImage (url) {
    return new Promise(async (resolve, reject) => {
        const image = new Image();

        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', () => reject(new Error('No se pudo cargar la imagen.')));

        image.src = url;
    });
}

export function hasDisallowedTags (content, allowedTags) {
    const container = document.createElement('div');
    container.innerHTML = content;

    const tags = container.getElementsByTagName('*');

    for (let i = 0; i < tags.length; i++) {
        const tag = tags[i].tagName.toLowerCase();
        if (!allowedTags.includes(tag)) {
            return true;
        }
    }

    return false;
}

export function cleanContent (content) {
    const escapedText = content
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

    const urlPattern = /(https?:\/\/[^\s]+)/g;
    const clickableText = escapedText.replace(urlPattern, function(url) {
        return `<a href="${url}" class="link" target="_blank">${url}</a>`;
    });

    return clickableText.replace(/\n/g, '<br>').trim();   
}