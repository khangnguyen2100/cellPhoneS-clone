const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
// slider settings
{
    const slider1 = new Swiper('.slider1', {
        loop: true,
        allowSlideNext : true,
        autoplay: {
            enabled: true,
            delay: 3000,
        },
        navigation: {
          nextEl: '.slider-btn-right',
          prevEl: '.slider-btn-left',
        },
    });
    const slider2 = new Swiper('.slider2', {
        loop: true,
        allowSlideNext : true,
        autoplay: {
            enabled: true,
            delay: 3300,
        },
        navigation: {
          nextEl: '.slider-btn-right',
          prevEl: '.slider-btn-left',
        },
    });
    const saleList = new Swiper('.sale-container', {
        loop: true,
        allowSlideNext : true,
        slidesPerView: 5,
        autoplay: {
            enabled: true,
            delay: 5000,
        },
        navigation: {
          nextEl: '.slider-btn-right',
          prevEl: '.slider-btn-left',
        },
        breakpoints : {
            0 : {
                slidesPerView : 3,
            },
            768 : {
                slidesPerView : 5,
            },
            
        }
    });
}
// elements
const API_URL = 'https://api.apify.com/v2/key-value-stores/Dk3WYwoH9GqWLc6Cm/records/LATEST'
const html = $('html')
const brandItems = $$('.brand-item');

const saleEl = $('.sale-list')
const phonesEl = $('.phones')
const searchEl = $(".search-input")
const filtering = $(".filtering")
const filteringList = $(".filtering-list")
const filteringItems = $$('.filtering-item')
let filteringContainer = {}
const filterItems = $$(".filter-item");
const filterBoxItems = $$('.filter-box-item')

const sortItems = $$(".sort-item");

// sort btn
const sortUp = $(".sort-up")
const sortDown = $(".sort-down")
const sortHot = $(".sort-hot")
// filter btn
const brandAndroid = $('.brand-android')
const brandIos = $('.brand-ios')
// data
var arrays = [],object = {},currentRender,currentBackUp,tsktContainer = [],array=[],temp=[],temp2=[]

// UI action 
{
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
    const SearchInput = $('.search-input');
    SearchInput.addEventListener('focus' , () => {
        overLay.classList.add('active')
    })
    SearchInput.addEventListener('blur' , () => {
        overLay.classList.remove('active')
    })
    locationMain.addEventListener('click' ,() => {
        locationHidden.classList.toggle('active')
        overLay.classList.toggle('active')
    })
    // count down 
    const dayEl = $('.days')
    const hourEl = $('.hours')
    const minuteEl = $('.minutes')
    const secondEl = $('.seconds')
    let second = 59,minute = 31,hour = 13,day = 1
    window.onload = () => {
        secondEl.innerText = second
        minuteEl.innerText = minute
        hourEl.innerText = hour
        dayEl.innerText = `0${day}`
        setInterval(() => {
            second >= 10 ? secondEl.innerText = second : secondEl.innerText = `0${second}`
            second--
            if(second == -1)  {
                changeMinute()
                second = 59
            }
        }, 1000);
    }
    function changeMinute() {
        minute >= 10 ? minuteEl.innerText = minute : minuteEl.innerText = `0${minute}`
        minute--
        if(minute == -1)  {
            changeHour()
            minute = 59
        }
    }
    function changeHour() {
        hour >= 10 ? hourEl.innerText = hour : hourEl.innerText = `0${hour}`
        hour--
        if(hour == -1)  {
            hour = 23
            changeDay()
        }
    }
    function changeDay() {
        dayEl.innerText = `0${day}`
        day--
    }
    // navigation 
    const btnMobile = $('.for-mobile');
    const aboutMobile = $('.about-mobile')
    btnMobile.addEventListener('click' ,() => {
        aboutMobile.classList.toggle('active')
        overLay.classList.toggle('active')
    })
        //active filter UI handle
    let filterItemCheck = undefined
    filterItems.forEach((filterItem,i) => {
        filterItem.addEventListener('click',() => {
            if(filterItemCheck !== undefined && i !== filterItemCheck) {
                filterItems[filterItemCheck].classList.remove('active')
            }
            filterItem.classList.toggle('active')
            filterItemCheck = i
        })
    })
    // active sort UI handle
    sortItems.forEach((sortItem,i) => {
        sortItem.addEventListener('click',() => {
            if(sortItems[0].classList.contains('active') && i == 1) {
                sortItems[0].classList.remove('active')
            }
            if( i == 0 && sortItems[1].classList.contains('active')) {
                sortItems[1].classList.remove('active')
            }
            sortItem.classList.toggle('active')
        })
    })
}

// call API
function getApi(api) {
    fetch(api)
    .then(res => res.json())
    .then(data => {
        app.start(data.phone)
    });
}
getApi(API_URL)
const app = {
    // sale section reder
    start : function(phones) {
        app.createData(phones)
        
        setTimeout(() => {
            app.renderSale(phones)
        }, 500);
        app.render(arrays)
        app.changeBrand(object)
    },
    createData : function(phones) {
        const arr = Object.values(phones)
        object = arr
        arr.forEach((ar,i) => {
            arrays.push(...ar)
        })
        let  name = []
        arrays.forEach((arr,i) => {
            name.push(arr.name)
        })
    },
    renderSale : function(phones) {
        const keys = Object.values(phones)
        let randomArray = []
        for (let i = 0; i < keys.length; i++) {
            randomArray.push(keys[i][Math.floor(Math.random()*keys[i].length)])
        }
        const htmls = randomArray.map((phone, i) => {
            return `
                <div class="phoneSale swiper-slide "data-name="${phone.name}">
                    <div class="phoneSale-sale-per">
                        ${Math.round((1 - phone.special_price/phone.old_price)*100)>0 ? 
                            `<img src="./img/someThings/image2.png" alt="">
                            <p>giảm ${Math.round((1 - phone.special_price/phone.old_price)*100)+'%'}</p>`
                        : ''}
                    </div>
                    <div class="phoneSale-img">
                        <img src="${phone.image}" alt="">
                    </div>
                    <h3 class="phoneSale-name">
                        ${phone.name}
                    </h3>
                    <div class="phoneSale-price">
                        <p class="phoneSale-price-sale">
                            ${phone.special_price?this.handlePrice(phone.special_price):this.handlePrice(phone.price)} đ
                        </p>
                        <p class="phoneSale-price-old">
                            ${phone.old_price ? this.handlePrice(phone.old_price) + ` đ`:''}
                        </p>
                    </div>
                </div>
                </div>
            `
        })
        saleEl.innerHTML = htmls.join('')
    },
    // phones reder
    render : function(phones) {
        currentRender = phones
        if(phones.length >= 50) {
            
        }
        const htmls = phones.map((phone,index) => {
            return `
                    <a href="./phone.html" class="phone" data-name="${phone.name}">
                        <div class="phone-sale-per">
                            ${Math.round((1 - phone.special_price/phone.old_price)*100)>0 ? 
                                `<img src="./img/someThings/image2.png" alt="">
                                <p>giảm ${Math.round((1 - phone.special_price/phone.old_price)*100)+'%'}</p>`
                            : ''}
                        </div>
                        <div class="phone-img">
                            <img src="${phone.image}" alt="">
                        </div>
                        <h3 class="phone-name">
                            ${phone.name}
                        </h3>
                      
                        <div class="phone-price">
                            <p class="phone-price-sale">
                                ${phone.special_price?this.handlePrice(phone.special_price):this.handlePrice(phone.price)} đ
                            </p>
                            <p class="phone-price-old">
                                ${phone.old_price ? this.handlePrice(phone.old_price) + ` đ`:''}
                            </p>
                        </div>
                        <div class="phone-rate">
                            <div class="phone-stars">
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                            </div>
                            <div class="phone-comment">
                                <p>${Math.floor(Math.random()*100)} đánh giá</p>
                            </div>
                        </div>
                    </a>
            `
        })
        if(phones.length == 0) {
            return phonesEl.innerHTML = `<h3 style="margin : 10rem 0; font-size : 2rem">Xin lỗi không có sản phẩm phù hợp với yêu cầu của bạn.</h3>`
        }
        // loading...
        $(".spinner-wrapper").classList.add('active')
        $(".overlay").classList.add('active')
        setTimeout(() => {
            phonesEl.innerHTML = htmls.join('')
            app.renderPhone()
            $(".spinner-wrapper").classList.remove('active')
            $(".overlay").classList.remove('active')
        }, 500);
    },
    // edit price to render
    handlePrice : function(price) {
        price = Array.from(price+'')
        let count = 0
        let leng = price.length
        while(leng>=3) {
            leng-=3
            price.splice(leng,0,'.')
        }
        return price.join('')
    },
    // handle render capacity
    renderCapacity : function(arrs) {
        let indexColor = 0 ,colors = 0,string = '',htmlSale
        if(arrs.colors) {
            for (let i = 0; i < arrs.colors.length; i++) {
                if(arrs.colors[i].color.length > colors) {
                    colors = arrs.colors[i].color.length
                    indexColor = i
                }
            }
            htmlSale = arrs.colors.map((arr,i) => {
                return `<a class="btn">${arr.color}</a>`
            })
        }
        else {
            for (let i = 0; i < arrs.capacities.length; i++) {
                if(arrs.capacities[i].color.length > colors) {
                    colors = arrs.capacities[i].color.length
                    indexColor = i
                }
            }
            htmlSale =  arrs.capacities[indexColor].color.map((arr,i) => {
                return `<a class="btn">${arr.color}</a>`
            })
        }
        htmlSale.forEach((el,i) => {
            string = string.concat(el)
        })  
        return    string
    },
    // handle change brand
    changeBrand : function(object) {
        // active brand
        let brandCurrentIndex = 11
        brandItems.forEach((brandItem,i) => {
            brandItem.addEventListener('click', () => {
                if(brandCurrentIndex !== undefined && brandCurrentIndex !== i) {
                    brandItems[brandCurrentIndex].classList.remove('active')
                }
                brandCurrentIndex = i

                brandItem.classList.toggle('active')
                if(i == brandItems.length - 1) {
                    this.render(arrays)
                }
                else {
                    this.render(object[i]) 
                }
            })
        })
    },
    // handle sort
    sortUpFunc : function(target) {
        if(this.check(target)) {
            for (let i = 0; i < currentRender.length-1; i++) {
                for (let j = i+1; j < currentRender.length; j++) {
                    if(currentRender[j].price) {
                        if(currentRender[j].price > currentRender[i].special_price) {
                            let temp = currentRender[j]
                            currentRender[j] = currentRender[i]
                            currentRender[i] = temp
                        }
                    }
                    else if(currentRender[i].price) {
                        if(currentRender[j].special_price > currentRender[i].price) {
                            let temp = currentRender[j]
                            currentRender[j] = currentRender[i]
                            currentRender[i] = temp
                        }
                    }
                    else if(currentRender[j].special_price > currentRender[i].special_price) {
                        let temp = currentRender[j]
                        currentRender[j] = currentRender[i]
                        currentRender[i] = temp
                    }
                }
            }
        }
        this.render(currentRender)
    },
    sortDownFunc : function(target) {
        if(this.check(target)) {
            for (let i = 0; i < currentRender.length-1; i++) {
                for (let j = i+1; j < currentRender.length; j++) {
                    if(currentRender[j].price) {
                        if(currentRender[j].price < currentRender[i].special_price) {
                            let temp = currentRender[j]
                            currentRender[j] = currentRender[i]
                            currentRender[i] = temp
                        }
                    }
                    else if(currentRender[i].price) {
                        if(currentRender[j].special_price < currentRender[i].price) {
                            let temp = currentRender[j]
                            currentRender[j] = currentRender[i]
                            currentRender[i] = temp
                        }
                    }
                    else if(currentRender[j].special_price < currentRender[i].special_price) {
                        let temp = currentRender[j]
                        currentRender[j] = currentRender[i]
                        currentRender[i] = temp
                    }
                }
            }
        }
        this.render(currentRender)
    },
    sortHotFunc : function(target) {
        if(this.check(target)) {
            currentRender = currentRender.filter((ar,i) => {
                if(ar.special_price/ar.old_price < 0.75) {
                    return ar
                }
            })
        }
        this.render(currentRender)
    },
    check : function(target) {
        if(target.classList.contains('active')) {
            currentBackUp = [...currentRender]
            return true
        }
        else {
            currentRender = currentBackUp
            return false
        }
    },
    // handle filter
    activeBoxItem : function(filterBoxItem) {
        // get name of filter in tag h3 and name of filter
        const filterBoxName = filterBoxItem.parentNode.previousElementSibling.innerText.trim()
        const filterItemName = filterBoxItem.innerText
        // change filter, remove all active and add active again
        if(filteringContainer.hasOwnProperty(filterBoxName)) {
            filterBoxItem.parentNode.childNodes.forEach((item,j) => {
                if(item.nodeValue == null && item.classList.contains('active')) {
                    item.classList.remove('active')
                }
            })
        }
        filterBoxItem.classList.toggle('active')
        app.addFilter(filterBoxName,filterItemName)
    },
    addFilter : function(filterBoxName,filterItemName) {
        // check to display section filtering
        if(Object.keys(filteringContainer).length == 0) {
            $(".filtering").style = "display : block"
        }
        // add to Object
        filteringContainer[filterBoxName] = filterItemName
        // remove all item, and then render all item
        $$('.filtering-item').forEach((item,i) => {
            item.remove()
        })
        const arrs = Object.values(filteringContainer)
        // render all values
        arrs.forEach((arr,i) => {
            const div = document.createElement("div");
            div.classList.add("active","filtering-item","filter-item")
            div.innerHTML = `<p class="btn filter-name">${arr}&ensp;
            <i class="fas fa-times-circle delete-item"></i>
            </p>`
            // insert before .remove-all to keep .remove-all always is the last
            filteringList.insertBefore(div, $(".remove-all"));;
        })
    },
    removeFilter : function(e,filteringItem)  {
        if(Object.values(filteringContainer).includes(filteringItem.innerText.trim()) && e.target.classList.contains('delete-item')) {
            // remove key in object
            for (let key in filteringContainer) {
                if (filteringContainer[key] == filteringItem.innerText.trim()) {
                    delete filteringContainer[key]
                };
            }
            // remove active in BoxItem
            filterBoxItems.forEach((filterBoxItem,i) => {
                if(filterBoxItem.innerText.trim().toLowerCase() == filteringItem.innerText.trim().toLowerCase()) {
                    filterBoxItem.classList.remove('active')
                }
            })
            //remove element
            filteringItem.remove()
            this.handleFilter()
        }
    },
    handleFilter : function() {
        const keys = Object.keys(filteringContainer)
        const values = Object.values(filteringContainer)
        array = [...arrays]
        keys.forEach((key,indexKey) => {
            temp = array.filter((phone) => {
                const tskts = phone.tskt
                for (let i = 0; i < tskts.length; i++) {
                    // RAM
                    if(key == "Dung Lượng RAM") {   
                        if(tskts[i].name == "Dung lượng RAM") {
                            if(values[indexKey] == "Dưới 4 Gb") {
                                if(parseInt(tskts[i].value) < 4) {
                                    return phone
                                }
                            }
                            if(values[indexKey] == "4Gb - 6Gb") {
                                if(parseInt(tskts[i].value) >= 4 && parseInt(tskts[i].value) <= 6) {
                                    return phone
                                }
                            }
                            if(values[indexKey] == "8Gb - 12Gb") {
                                if(parseInt(tskts[i].value) >= 8 && parseInt(tskts[i].value) <= 12) {
                                    return phone
                                }
                            }
                            if(values[indexKey] == "12Gb Trở Lên") {
                                if(parseInt(tskts[i].value) > 12) {
                                    return phone
                                }
                            }
                        }
                    }
                    // ROM
                    if(key == "Bộ Nhớ Trong") {
                        if(tskts[i].name == "Bộ nhớ trong") {
                            if(values[indexKey] == "Dưới 32Gb") {
                                if(parseInt(tskts[i].value) < 32) {
                                    return phone
                                }
                            }
                            if(values[indexKey] == "32Gb Và 64Gb") {
                                if(parseInt(tskts[i].value) >= 32 && parseInt(tskts[i].value) <= 64) {
                                    return phone
                                }
                            }
                            if(values[indexKey] == "128Gb Và 256b") {
                                if(parseInt(tskts[i].value) >= 128 && parseInt(tskts[i].value) <= 256) {
                                    return phone
                                }
                            }
                            if(values[indexKey] == "Trên 512Gb") {
                                if(parseInt(tskts[i].value) > 512) {
                                    return phone
                                }
                            }
                        }
                    }
                    // SIZE SCREEN
                    if(key == "Kích Thước Màn Hình") {
                        if(tskts[i].name == "Kích thước màn hình") {
                            if(values[indexKey] == "Dưới 6 Inch") {
                                if(parseInt(tskts[i].value) < 6) {
                                    return phone
                                }
                            }
                            if(values[indexKey] == "Trên 6 Inch") {
                                if(parseInt(tskts[i].value) >= 6) {
                                    return phone
                                }
                            }
                        }
                    }
                    // TYPE SCREEN
                    if(key == "Kiểu Màn Hình") {
                        if(tskts[i].name == "Kiểu màn hình") {
                            if(values[indexKey] == "Đục Lỗ (Nốt Rùi)") {
                                if(tskts[i].value.includes("Đục lỗ")) {
                                    return phone
                                }
                            }
                            if(values[indexKey] == "Giọt Nước") {
                                if(tskts[i].value.includes("Giọt nước")) {
                                    return phone
                                }
                            }
                            if(values[indexKey] == "Tai Thỏ") {
                                if(tskts[i].value.includes("Tai thỏ")) {
                                    return phone
                                }
                            }
                            if(values[indexKey] == "Tràn Viền (Không Khuyết Điểm)") {
                                if(tskts[i].value.includes("Tràn viền")) {
                                    return phone
                                }
                            }
                            if(values[indexKey] == "Màn Hình Gập") {
                                if(tskts[i].value.includes("Màn hình gập")) {
                                    return phone
                                }
                            }
                        }
                    }
                    // WEIGHT
                    if(key == "Trọng Lượng") {   
                        if(tskts[i].name == "Trọng lượng") {
                            if(values[indexKey] == "Dưới 160g") {
                                if(parseInt(tskts[i].value) < 160) {
                                    return phone
                                }
                            }
                            if(values[indexKey] == "160g - 190g") {
                                if(parseInt(tskts[i].value) >= 160 && parseInt(tskts[i].value) <= 190) {
                                    return phone
                                }
                            }
                            if(values[indexKey] == "190g - 220g") {
                                if(parseInt(tskts[i].value) >= 190 && parseInt(tskts[i].value) <= 220) {
                                    return phone
                                }
                            }
                            if(values[indexKey] == "Từ 220g Trở Lên") {
                                if(parseInt(tskts[i].value) > 220) {
                                    return phone
                                }
                            }
                        }
                    }
                }
                // PRICE
                if(key == "Giá") {
                    const price = phone.special_price? phone.special_price : phone.price;
                    if(values[indexKey] == "Dưới 5 Triệu") {
                        if(price < 5000000) {
                            return phone
                        }
                    }
                    if(values[indexKey] == "5 - 10 Triệu") {
                        if(price >= 5000000 && price <= 10000000) {
                            return phone
                        }
                    }
                    if(values[indexKey] == "10 - 15 Triệu") {
                        if(price >= 10000000 && price <= 15000000) {
                            return phone
                        }
                    }
                    if(values[indexKey] == "15 - 20 Triệu") {
                        if(price >= 15000000 && price <= 20000000) {
                            return phone
                        }
                    }
                    if(values[indexKey] == "Trên 20 Triệu") {
                        if(price >= 20000000) {
                            return phone
                        }
                    }
                }
            })
            if(keys.length>1) array = temp
        })
        app.render(temp)
    },
    // search handle 
    renderSearch : function(e) {
        const keyWords = e.target.value
        let result = []
        result = [...arrays].filter(arr => arr.name.toLowerCase().includes(keyWords.toLowerCase()))

        // keyWords.forEach((key,i) => {
        //     if(key !== '') {
        //         result = [...arrays].filter(arr => arr.name.toLowerCase().includes(key.toLowerCase()))
        //     }
        // })
        $('.overlay').classList.remove('active')
        this.render(result)
    },
    // loading function
    loading : function() {

    },
    // phone page
    renderPhone : function() {
        const phones = $$(".phone")
        phones.forEach((phone,i) => {
            phone.addEventListener("click" ,() => {
                sendData(phone)
            })  
        })
        $$(".phoneSale").forEach((phone,i) => {
            phone.addEventListener("click" ,() => {
                sendData(phone)
            }) 
        })
        function sendData(phone) {
            const array = arrays
            const phoneName = phone.dataset.name
            localStorage.setItem("array", JSON.stringify(array));
            localStorage.setItem("phoneName", JSON.stringify(phoneName));
            window.location.href="phone.html";
        }
    },
}
// CLICK ACTION
sortUp.addEventListener('click' , (e) => {
    app.sortUpFunc(e.target.parentNode)
})
sortDown.addEventListener('click' , (e) => {
    app.sortDownFunc(e.target.parentNode)
})
sortHot.addEventListener('click' , (e) => {
    app.sortHotFunc(e.target.parentNode)
})

$(".remove-all").addEventListener('click' ,() => {
    $(".filtering").style = "display : none"
    filteringContainer = {}
    filterBoxItems.forEach((filterBoxItem,i) => {
        filterBoxItem.classList.remove('active')
    })
    app.render(arrays)
})

// add to filtering
filterBoxItems.forEach((filterBoxItem,i) => {
    filterBoxItem.addEventListener('click' ,() => {
        app.activeBoxItem(filterBoxItem)
    })
})

// remove from filtering
filteringList.addEventListener('click' , ()=> {
    $$('.filtering-item').forEach((filteringItem,i) => {
        filteringItem.addEventListener('click' , (e) => {
            app.removeFilter(e,filteringItem)
        })
    })
})
filterBoxItems.forEach((filterBoxItem) => {
    filterBoxItem.addEventListener('click', app.handleFilter)
})
window.addEventListener('load' ,()  => {
    localStorage.setItem("array", 0);
    localStorage.setItem("phoneName", 0);
})

searchEl.onchange = (e) => {
    app.renderSearch(e)
}