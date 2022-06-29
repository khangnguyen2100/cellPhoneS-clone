let nf = new Intl.NumberFormat();
let $ = document.querySelector.bind(document)
let $$ = document.querySelectorAll.bind(document)
const amountNumEl = $('.bag-amount-item')
function formatPrice(price) {
    return `${nf.format(+price)} đ`
}
// Header location change
const locationHidden = $('.location-hidden');
const locationMain = $('.location-main');
const locationCurrent = $('.location-current');
const locationItems = $$('.location-item');
locationItems.forEach((locationItem,i) => {
    locationItem.addEventListener('click', () => {
        locationItems.forEach((locationItem,i) => {
            if(locationItem.classList.contains('active')) {
                locationItem.classList.remove('active')
            }
        })
        locationItem.classList.toggle('active')
        rederLocation(i)
    })
})
function rederLocation(i) {
    const text = locationItems[i].innerText
    locationCurrent.innerText = text
}
// handle overlay 
const overLay = $('.overlay');
const searchInput = $('.search-input');
searchInput.addEventListener('focus' , () => {
    overLay.classList.add('active')
})
searchInput.addEventListener('blur' , () => {
    overLay.classList.remove('active')
})
locationMain.addEventListener('click' ,() => {
    locationHidden.classList.toggle('active')
    overLay.classList.toggle('active')
})
// navigation 
const btnMobile = $('.for-mobile');
const aboutMobile = $('.about-mobile')
btnMobile.addEventListener('click' ,() => {
    aboutMobile.classList.toggle('active')
    overLay.classList.toggle('active')
})
// render total shopping list

let amountShoppingList = 0

if(sessionStorage.phoneInfo) {
    JSON.parse(sessionStorage.phoneInfo).forEach((obj,i) => {
        amountShoppingList += obj.amountInput
    })
    amountNumEl.innerText = amountShoppingList
    sessionStorage.setItem('amountShoppingList', amountShoppingList)
} else {
    
}

function filterPhoneName(arrays,phoneName) {
    return arrays.filter(arr => arr.name == phoneName)[0]
}
