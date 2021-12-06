const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
{
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
    // navigation 
    const btnMobile = $('.for-mobile');
    const aboutMobile = $('.about-mobile')
    btnMobile.addEventListener('click' ,() => {
        aboutMobile.classList.toggle('active')
        overLay.classList.toggle('active')
    })
}
window.addEventListener('load' ,() => {
    var array = localStorage.getItem("array");
    array = JSON.parse(array)
    var phoneName = localStorage.getItem("phoneName");
    phoneName = JSON.parse(phoneName)
    render(array,phoneName)

    //active filter UI handle
    let optionCheck
    const btnOptions = $$(".phonePage-option-btn")
    btnOptions.forEach((btnOption,i) => {
        btnOption.addEventListener('click',() => {
            if(optionCheck !== undefined && i !== optionCheck) {
                btnOptions[optionCheck].classList.remove('active')
            }
            btnOption.classList.toggle('active')
            optionCheck = i
        })
    })
    let colorCheck
    const btnColors = $$(".phonePage-color-btn")
    btnColors.forEach((btnColor,i) => {
        btnColor.addEventListener('click',() => {
            if(colorCheck !== undefined && i !== colorCheck) {
                btnColors[colorCheck].classList.remove('active')
            }
            btnColor.classList.toggle('active')
            colorCheck = i
        })
    })
})
function render(array,phoneName) {
    const currentArray = array.find((arr,i) => {
        return arr.name == phoneName
    })
    $(".phone-main-name").innerText = currentArray.name
    $(".comment").innerText = Math.floor(Math.random()*100) + " đánh giá"
    
    // gallery main
    const galleryMain = currentArray.images.map((img,i) => {
        return  `
            <div class="swiper-slide gallery-img">
                <img src="${img}" alt="">
            </div>
        `
    })
    $(".gallery-container").innerHTML = galleryMain.join('')

    // gallery thumb
    $(".gallery-thumb-container").innerHTML = galleryMain.join('')
    
    // price 
    $(".phonePage-info h3").innerText = `${currentArray.special_price ? handlePrice(currentArray.special_price) : handlePrice(currentArray.price)} đ`
    $(".phonePage-info p").innerText = `${currentArray.old_price ? handlePrice(currentArray.old_price) : handlePrice(currentArray.price)} đ`
    
    // slider
    {
        const galleryThumb = new Swiper('.gallery-thumb', {
            loop: true,
            spaceBetween: 10,
            slidesPerView: 5,
            freeMode: true,
            watchSlidesProgress: true,
        });
        const galleryMainSlider = new Swiper('.gallery-main', {
            loop: true,
            allowSlideNext : true,
            autoplay: {
                enabled: true,
                delay: 3000,
            },
            spaceBetween: 10,
            thumbs: {
              swiper: galleryThumb,
            },
            grabCursor: true,
            effect: "creative",
            creativeEffect: {
              prev: {
                shadow: true,
                translate: [0, 0, -400],
              },
              next: {
                translate: ["100%", 0, 0],
              },
            },
        });
    }
    
    // capacities
    const optionBtn = currentArray.capacities.map((arr,i) => {
        return `
            <a class="btn phonePage-option-btn">
                <h3 class="option-name">
                    ${arr.capacity}
                </h3>
                <p class="option-price">
                    ${handlePrice(arr.price)}&nbsp;đ
                </p>
            </a>
        `
    })
    $(".phonePage-option").innerHTML = optionBtn.join('')
    
    // find a max color
    let indexColor = 0 ,colors = 0,colorBtn
    {
        if(currentArray.colors) {
            for (let i = 0; i < currentArray.colors.length; i++) {
                if(currentArray.colors[i].color.length > colors) {
                    colors = currentArray.colors[i].color.length
                    indexColor = i
                }
            }
            colorBtn = currentArray.colors.map((arr,i)=> {
                return `
                    <a class="btn phonePage-color-btn">
                        <h3 class="color-name">${arr.color}</h3>
                        <p class="color-price">${handlePrice(arr.price)} đ</p>
                    </a>
                `
            })
        }
        else {
            for (let i = 0; i < currentArray.capacities.length; i++) {
                if(currentArray.capacities[i].color.length > colors) {
                    colors = currentArray.capacities[i].color.length
                    indexColor = i
                }
            }
            colorBtn = currentArray.capacities[indexColor].color.map((arr,i)=> {
                return `
                    <a class="btn phonePage-color-btn">
                        <h3 class="color-name">${arr.color}</h3>
                        <p class="color-price">${handlePrice(arr.price)} đ</p>
                    </a>
                `
            })
        }
    }
    $(".color-content").innerHTML = colorBtn.join('')
    
    // tskt render
    const tsktEl = currentArray.tskt.map((arr,i) => {
        return `
        <li class="information-content-item">
            <div class="information-content-name">
                ${arr.name}
            </div>
            <div class="information-content-value">
                ${arr.value}
            </div>
        </li>
        `
    })
    $(".information-content").innerHTML = tsktEl.join('')
}
function handlePrice(price) {
    price = Array.from(price+'')
    let count = 0
    let leng = price.length
    while(leng>=3) {
        leng-=3
        price.splice(leng,0,'.')
    }
    return price.join('')
}