const DRAFTS_KEY = "drafts";

function generateUniqueId() {
    return `draft-${Date.now()}-${(Math.random() + 1).toString(36).substring(7)}`;
}

function loadPostToLocalStorage(draft) {
    let draftsArray = JSON.parse(localStorage.getItem(DRAFTS_KEY)) || [];
    draftsArray.push(draft);
    localStorage.setItem(DRAFTS_KEY, JSON.stringify(draftsArray));
}

function dumpAllPostsFromLocalStorage() {
    return JSON.parse(localStorage.getItem(DRAFTS_KEY) || "[]");
}

function removeFromLocalStorage(id) {
    let draftsArray = dumpAllPostsFromLocalStorage();

    draftsArray = draftsArray.filter(draft => {
        const tempElement = document.createElement("div");
        tempElement.innerHTML = draft.trim();
        const draftId = tempElement.querySelector("input[name='post-id']").value;
        return draftId !== id;
    });

    localStorage.setItem(DRAFTS_KEY, JSON.stringify(draftsArray));
}

function updateInLocalStorage(id, updatedHeader, updatedBoard, updatedBody) {
    let draftsArray = dumpAllPostsFromLocalStorage();

    draftsArray = draftsArray.map(draft => {
        const tempElement = document.createElement("div");
        tempElement.innerHTML = draft.trim();
        const draftId = tempElement.querySelector("input[name='post-id']").value;

        if (draftId === id) {
            return createDraftElement(updatedHeader, updatedBoard, updatedBody, draftId);
        }
        return draft;
    });

    localStorage.setItem(DRAFTS_KEY, JSON.stringify(draftsArray));
}

function drawPosts() {
    let placeholder = document.getElementById("drafts-placeholder");
    let drafts = dumpAllPostsFromLocalStorage();
    placeholder.innerHTML = "";
    for (const draft of drafts) {
        placeholder.innerHTML += draft;
    }
}

function removeElement(button) {
    const draftElement = button.closest(".post__draft");
    const draftId = draftElement.querySelector("input[name='post-id']").value;

    removeFromLocalStorage(draftId);
    drawPosts();
}

function updateElement(button) {
    const draftElement = button.closest(".post__draft");
    const draftId = draftElement.querySelector("input[name='post-id']").value;

    const updatedHeader = draftElement.querySelector("input[name='post-header']").value;
    const updatedBoard = draftElement.querySelector("select.input__option").value;
    const updatedBody = draftElement.querySelector("textarea[name='post-body']").value;

    updateInLocalStorage(draftId, updatedHeader, updatedBoard, updatedBody);
    drawPosts();
}

function createDraftElement(header, board, body, id = null) {
    const uniqueId = id || generateUniqueId();
    return `<div class="post__draft">
                <input type="hidden" name="post-id" value="${uniqueId}">
                <label>
                    <input class="input" name="post-header" type="text" value="${header}">
                </label>
                <label>
                    <select class="input__option">
                        <option ${board === "/b/" ? 'selected="selected"' : ""}>/b/</option>
                        <option ${board === "/v/" ? 'selected="selected"' : ""}>/v/</option>
                        <option ${board === "/po/" ? 'selected="selected"' : ""}>/po/</option>
                    </select>
                </label>
                <label>
                    <textarea class="textarea__multiline" name="post-body">${body}</textarea>
                </label>
                <button class="form-box__button_small" onclick="updateElement(this)">Update draft</button>
                <button class="form-box__button_small_ok">Publish draft</button>
                <button class="form-box__button_small_cancel" onclick="removeElement(this)">Delete draft</button>
            </div>`;
}

function assignCallback() {
    const form = document.getElementById("draft-form");

    form.addEventListener("submit", function (event) {
        const element = createDraftElement(
            form.postHeader.value,
            form.postBoard.value,
            form.postBody.value
        );
        loadPostToLocalStorage(element);
        drawPosts();
        event.preventDefault();
        return false;
    });
}

(() => {
    window.addEventListener("load", () => {
        assignCallback();
        drawPosts();
    });
})();
