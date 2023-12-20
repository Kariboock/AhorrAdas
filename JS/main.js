/* Useful Features */

const $ = (selector) => document.querySelector(selector)
const $$ = (selector) => document.querySelectorAll(selector)

const randomId = () => self.crypto.randomUUID()

const setData = (key, data) => localStorage.setItem(key, JSON.stringify(data));
const getData = (key) => JSON.parse(localStorage.getItem(key));

const hiddenElement = (selectors) => {
    for (const selector of selectors) {
        $(selector).classList.add("hidden")
    }
}

/* Nav events */
$("#balance-btn-nav").addEventListener('click', () => {
    $("#balances-section").classList.remove('hidden');
    hiddenElement(["#new-operations-section", "#category-section", "#reports-section", "#category-edit-section"])
});


$("#category-btn-nav").addEventListener('click', () => {
    $("#category-section").classList.remove('hidden');
    hiddenElement(["#balances-section", "#new-operations-section", "#reports-section", "#category-edit-section"])
});

$("#reports-btn-nav").addEventListener('click', () => {
    $("#reports-section").classList.remove('hidden');
    hiddenElement(["#category-section", "#balances-section", "#new-operations-section", "#category-edit-section"])
});


$("#new-operation-btn").addEventListener('click', () => {
    $("#new-operations-section").classList.remove('hidden');
    hiddenElement(["#reports-section", "#category-section", "#balances-section", "#category-edit-section"]);
})