const BASE_URL = "https://json-placeholder.mock.beeceptor.com";
const LOADER_NODE = `<div id="loading-animation" class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>`;

function showLoadingAnimation() {
    const parent = document.getElementById("loader-placeholder");
    parent.innerHTML = LOADER_NODE;
}

function hideLoadingAnimation() {
    const parent = document.getElementById("loader-placeholder");
    parent.innerHTML = "";
}

function apiError(e) {
    document.getElementById("posts-placeholder").innerHTML += `<div>
        <p>Loading error :(</p>
        <p>Try again later</p>
    </div>`;
}

async function baseFetch(url) {
    try {
        const response = await fetch(url);
        if (!response.status / 100 === 2) {
            apiError(null);
        }
        return await response.json();
    } catch (e) {
        apiError(e)
    }

    return null
}

async function fetchPosts() {
    return await baseFetch(BASE_URL + "/posts")
}

async function fetchComments() {
    return await baseFetch(BASE_URL + "/comments")
}

function joinPostsWithComments(posts, comments) {
    let map = new Map();

    for (const post of comments) {
        if (!map.has(post.id)) {
            map.set(post.id, [post, []]);
        }
    }

    for (const comment of comments) {
        if (map.has(comment.postId)) {
            map.get(comment.postId)[1].push(comment);
        }
    }

    return Array.from(map, ([_, value]) => [value[0], value[1]]);
}

async function fullFetch() {
    let [posts, comments] = await Promise.all([fetchPosts(), fetchComments()]);

    if (posts != null && comments != null) {
        return joinPostsWithComments(posts, comments);
    }

    return null;
}

function drawComments(comments) {
    let result = "";
    for (const comment of comments) {
        result += `<div class="comments__comment">
                        <p class="paragraph__time">1900-01-01 00:00:00</p>
                        <p>${comment.body}</p>
                    </div>`;
    }

    return result
}

function drawPosts(posts) {
    let result = "";
    for (const [post, comments] of posts) {
        const commentsShortcut = drawComments(comments);
        result += `<div class="board">
                <h3>${post.email}</h3>
                <p>${post.body}</p>
                <div class="comments__section">
                    ${commentsShortcut}
                </div>
            </div>`;
    }

    return result
}

(() => {
    window.addEventListener("load", () => {
        showLoadingAnimation();
        fullFetch().then(r => {
            if (r != null) {
                const result = drawPosts(r);
                document.getElementById("posts-placeholder").innerHTML += result;
            }
            hideLoadingAnimation();
        });
    });
})();