window.addEventListener("DOMContentLoaded", init);
const preloader = {
    visible: !0,
    wrapper: null,
    setup() {
        wrapper = document.createElement("div");
        for (let e = 0; e < 5; e++) {
            const t = document.createElement("div");
            t.style.animationDelay = Number("0." + e - .2) + "s", wrapper.appendChild(t)
        }
        wrapper.id = "preloader", document.body.prepend(wrapper)
    },
    _setVisible(e) {
        this.visible = e, wrapper.style.display = this.visible ? "flex" : "none"
    },
    toggle() {
        this._setVisible(!this.visible)
    },
    hide() {
        this._setVisible(!1)
    },
    show() {
        this._setVisible(!0)
    }
};

function setupSearch() {
    document.querySelector("form").addEventListener("submit", e => {
        e.preventDefault(), getData(document.querySelector("#searchField").value), document.querySelector("#posts").innerHTML = "", preloader.show()
    })
}

function init() {
    setupSearch(), preloader.setup(), getData(), setupNav()
}

function setupNav() {
    fetch("https://kea-alt-del.dk/t9_2019_autumn/wp-json/wp/v2/categories").then(e => e.json()).then(e => e.forEach(addMenuItem))
}

function addMenuItem(e) {
    if (e.count > 0 && 14 === e.parent) {
        console.log(e);
        const t = document.createElement("a");
        t.textContent = e.name, t.setAttribute("href", "?category=" + e.id), document.querySelector("nav").appendChild(t)
    }
}

function getData(e = "") {
    fetch("https://kea-alt-del.dk/t9_2019_autumn/wp-json/wp/v2/book?_embed" + (e ? "&search=" + e : "")).then(e => e.json()).then(handleData)
}

function handleData(e) {
    preloader.hide(), e.forEach(showPost)
}

function showPost(e) {
    const t = e._embedded["wp:featuredmedia"][0].media_details.sizes.thumbnail.source_url,
        n = document.querySelector(".postTemplate").content.cloneNode(!0);
    n.querySelector("h1").textContent = e.title.rendered;
    const r = n.querySelector("img.cover");
    r.setAttribute("src", t), r.setAttribute("alt", "The cover of " + e.title.rendered), n.querySelector("section").innerHTML = e.content.rendered, n.querySelector(".publisher").innerHTML = e.publisher, document.querySelector("#posts").appendChild(n)
}
