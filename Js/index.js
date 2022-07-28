// slider settings
{
    const slider1 = new Swiper('.slider1', {
        loop: true,
        allowSlideNext : true,
        autoplay: {
            enabled: true,
            delay: 5000,
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
            delay: 5300,
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

const phonesEl = $('.phones')
const searchEl = $(".search-input")
const btnClose = document.querySelector(".btn-close")
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
var arrays = [],object = {},currentRender,currentBackUp,array=[],temp=[]

// UI action 
{
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
            sortItems.forEach((item,j) => {
                if(i !== j) item.classList.remove('active')
            })
            sortItem.classList.toggle('active')
            app.handleSorts(sortItem,i)
        })
    })
}
// call API
function getApi(api) {
    $(".spinner-wrapper").classList.add('active')
    $(".overlay").classList.add('active')

    fetch(api)
    .then(res => {
        return res.json()
    })
    .then(data => {
        sessionStorage.setItem('data',JSON.stringify(data.phone))
        app.start(JSON.parse(sessionStorage.getItem('data')))

        $(".spinner-wrapper").classList.remove('active')
        $(".overlay").classList.remove('active')
    });
}

if(sessionStorage.getItem('data') == undefined) {
    getApi(API_URL)
} else {
    setTimeout(() => {
        app.start(JSON.parse(sessionStorage.getItem('data')))
    }, 0);
}

const app = {
    // sale section reder
    start : function(phones) {
        this.createData(phones)
        
        this.render(arrays)
        this.changeBrand(object)
    },
    init : function() {

    },
    createData : function(phones) {
        const arrayOfObj = Object.values(phones)
        object = arrayOfObj
        arrayOfObj.forEach(ar => {
            return arrays.push(...ar)
        })
        sessionStorage.setItem('arrays',JSON.stringify(arrays))
        
    },
    // phones reder
    render : function(phones) {
        currentRender = phones
        const htmls = phones.map((phone,index) => {
            const salePrice = Math.round((1 - phone.special_price/phone.old_price)*100)
            const imgUrl = phone?.image?.replace('cdn.cellphones.com.vn','cdn2.cellphones.com.vn/358x')

            return `
                    <a href="./phone.html" class="phone" data-name="${phone.name}">
                        <div class="phone-sale-per">
                            ${salePrice > 0 ? 
                                `<img src="./img/images/image2.png">
                                <p>giảm ${salePrice + '%'}</p>`
                            : ''}
                        </div>
                        <div class="phone-img">
                            <img src="${imgUrl}" onerror="this.onerror=null; this.src='./img/not_found.jpg';"  alt="Image not found">
                        </div>
                        <h3 class="phone-name">
                            ${phone.name}
                        </h3>
                        <div class="phone-price">
                            <p class="phone-price-sale">
                                ${formatPrice(phone.special_price ? phone.special_price : phone.price)}
                            </p>
                            <p class="phone-price-old">
                                ${phone.old_price ? formatPrice(phone.old_price) : ''}
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
                                <p>35 đánh giá</p>
                            </div>
                        </div>
                    </a>
            `
        })
        phonesEl.innerHTML = htmls.join('')
        app.renderPhone()
        sessionStorage.setItem('arrays', JSON.stringify(currentRender))
        if(phones.length == 0) {
            return phonesEl.innerHTML = `<h3 style="margin : 10rem 0; font-size : 2rem">Xin lỗi không có sản phẩm phù hợp với yêu cầu của bạn.</h3>`
        }
    },
    // handle change brand
    changeBrand : function(object) {
        // active brand
        let lastIndex = 11
        brandItems.forEach((brandItem,index) => {
            brandItem.addEventListener('click', () => {
                // save lastIndex and remove it in the second time click
                brandItems[lastIndex].classList.remove('active')
                lastIndex = index

                brandItem.classList.toggle('active')
                // render see all
                if(index == brandItems.length - 1) {
                    this.render(arrays)
                }
                else {
                    // render brand
                    this.render(object[index]) 
                }
            })
        })
    },
    handleSorts : function(sortItem,key) {
        switch (key) {
            case 0:
                if(this.check(sortItem)) {
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
                break;
            case 1:
                if(this.check(sortItem)) {
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
                break;
            case 2:
                if(this.check(sortItem)) {
                    currentRender = currentRender.filter((ar,i) => {
                        if(ar.special_price/ar.old_price < 0.75) {
                            return ar
                        }
                    })
                }
                break;
            }
        this.render(currentRender)
    },
    
    check : function(target) {
        if(target.classList.contains('active')) {
            currentBackUp = [...currentRender]
            return true
        }
        else {
            currentRender = [...currentBackUp]
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
        array = [...currentRender]
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
        let result = [...arrays]
        if(e) {
            const keyWords = e.target.value
            result = [...arrays].filter(arr => arr.name.toLowerCase().includes(keyWords.toLowerCase()))
        }
        $('.overlay').classList.remove('active')
        this.render(result)
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
            sessionStorage.setItem("arrays", JSON.stringify(arrays));
            sessionStorage.setItem("phoneName", phone.dataset.name);
        }
    },
}

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


searchEl.onchange = (e) => {
    app.renderSearch(e)
}
searchEl.oninput = (e) => {
    btnClose.classList.add("see")
}
btnClose.addEventListener("click" ,() => {
    btnClose.classList.remove("see")
    searchEl.value = ""
    app.renderSearch('')
})
window.addEventListener("keydown", (e) => {
    if(e.key === "/") {
        setTimeout(() => {
            searchEl.focus()
        }, 0);
    }
})
