function hasNoWhitespaceParam() {
    return getURLParameter('w') !== null; // Right now w can have any value as long is present gh will remove whitespace
}

function getWhitespaceUrl(url) {
    return removeParameter(url, 'w');
}

function getNoWhitespaceUrl(url) {
    return insertParameter(url, 'w', '1');
}

function isFilesView() {
    return window.location.href.includes('/files');
}

function getUrlToReload() {
    let url = document.location.href;

  // No PR
    if (url.indexOf('/pull/') === -1) {
        return url;
    }

  // PR on files tab
    if (url.indexOf('/files') > -1) {
        return url;
    }

  // PR on commits tab
    if (url.indexOf('/commits') > -1) {
        return url.replace(/commits/g, 'files');
    }

  // PR on conversation tab
    return `${document.location.origin + document.location.pathname}/files${document.location.search}`;
}

function handleUrl(firstLoad) {
    let urlToReload = getUrlToReload();
    let whitespaceUrl = getWhitespaceUrl(urlToReload);
    let noWhitespaceUrl = getNoWhitespaceUrl(urlToReload);

    let buttonGroup = $('<div class="diffbar-item diffbar-whitespace"><div class="BtnGroup"></div></div>');

    let displayWhitespace = hasNoWhitespaceParam();
    let whitespace;
    let noWhitespace;

    // Initial load? Histpory.replaceState with the `w=1` query param
    if (firstLoad && isFilesView() && !displayWhitespace) {
        window.history.replaceState({}, '', `${window.location.href}?w=1`);
        handleUrl(false);
    } else {
        $(document).on('click', '.btn-whitespace', (e) => {
            e.preventDefault();
            window.history.replaceState({}, '', $(e.target).attr('href'));
            handleUrl(false);
        });

        if (hasNoWhitespaceParam()) {
            whitespace = $(`<a class="btn btn-sm btn-outline BtnGroup-item tooltipped tooltipped-s btn-whitespace" href="${whitespaceUrl}" aria-label="View whitespace diff">Whitespace</a>`);
            noWhitespace = $(`<button type="button" class="btn btn-sm btn-outline BtnGroup-item tooltipped tooltipped-s bg-gray-light text-gray-light" href="${noWhitespaceUrl}" aria-label="Hide whitespace diff" disabled="">No whitespace</button>`);
        } else {
            whitespace = $(`<button type="button" class="btn btn-sm btn-outline BtnGroup-item tooltipped tooltipped-s bg-gray-light text-gray-light" href="${whitespaceUrl}" aria-label="View whitespace diff" disabled="">Whitespace</button>`);
            noWhitespace = $(`<a class="btn btn-sm btn-outline BtnGroup-item tooltipped tooltipped-s btn-whitespace" href="${noWhitespaceUrl}" aria-label="Hide whitespace diff">No whitespace</a>`);
        }

        buttonGroup.append(whitespace);
        buttonGroup.append(noWhitespace);

        let whitespaceElem = $('.diffbar-whitespace');

        if (whitespaceElem.length === 0) {
            // buttonGroup.insertBefore($('.pr-review-tools > div.diffbar-item').first());
            buttonGroup.insertBefore($('.user-nav').first());
        } else {
            // $('.pr-review-tools .diffbar-whitespace').replaceWith(buttonGroup);
            $('.diffbar-whitespace').replaceWith(buttonGroup);
        }
    }
}

// Init on document ready
$(() => {
    handleUrl(true);
});
