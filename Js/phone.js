
window.addEventListener('load' ,() => {
    var arrays = JSON.parse(sessionStorage.getItem("arrays"))
    var phoneName = sessionStorage.getItem("phoneName")

    render(arrays,phoneName)

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
function render(arrays,phoneName) {
    const currentArray = filterPhoneName(arrays,phoneName)
    $(".phone-main-name").innerText = currentArray.name
    $(".comment").innerText = "35 đánh giá"
    
    // gallery main
    const galleryMain = currentArray.images.map((img,i) => {
        img = img.replace('cdn.cellphones.com.vn','cdn2.cellphones.com.vn/358x')
        return  `
            <div class="swiper-slide gallery-img">
                <img src="${img}" onerror="this.onerror=null; this.src='./img/not_found.jpg';" alt="Image not found">
            </div>
        `
    })
    $(".gallery-container").innerHTML = galleryMain.join('')

    // gallery thumb
    $(".gallery-thumb-container").innerHTML = galleryMain.join('')
    
    // price 
    $(".phonePage-info h3").innerText = formatPrice(currentArray.special_price ? currentArray.special_price : currentArray.price)
    $(".phonePage-info p").innerText = formatPrice(currentArray.old_price ? currentArray.old_price : currentArray.price)
    
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
            <a class="btn phonePage-option-btn" data-index="${arr.capacity}">
                <h3 class="option-name">
                    ${arr.capacity}
                </h3>
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
                    <a class="btn phonePage-color-btn" data-index="${arr.color}">
                        <h3 class="color-name">${arr.color}</h3>
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
                    <a class="btn phonePage-color-btn" data-index="${arr.color}">
                        <h3 class="color-name">${arr.color}</h3>
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
const addPhoneBtn = $('.addPhoneBtn')
const phoneValid = $('.phone-valid')
addPhoneBtn.addEventListener('click' ,() => {

    let  phonePageOptionBtnIndex = $('.phonePage-option-btn.active')
    console.log(phonePageOptionBtnIndex)
    let phonePageColorBtnIndex = $('.phonePage-color-btn.active')

    if($('.phonePage-option').children.length == 0) {
        phonePageOptionBtnIndex = 'unKnow'
    }
    
    if($('.color-content').children.length == 0) {
        phonePageOptionBtnIndex = 'unKnow'
    }
    if(phonePageColorBtnIndex == null || phonePageOptionBtnIndex == null) {
        phoneValid.innerText = 'Vui lòng chọn tùy chọn và màu'
    } else {
        phoneValid.innerText = ''
        let temp = [],check = true
        let name = sessionStorage.getItem('phoneName')
        const phoneInfoData = sessionStorage.getItem('phoneInfo')
        //second time, save all to temp and check if phoneIdex [trung]
        if(phoneInfoData) {
            temp = JSON.parse(phoneInfoData)
            temp.forEach((obj,i) => {
                if (
                    name == obj.phoneName && 
                    obj.option == phonePageOptionBtnIndex?.dataset?.index && 
                    obj.color == phonePageColorBtnIndex?.dataset?.index
                    ){
                        +obj.amountInput++
                        check = false
                        sessionStorage.setItem('phoneInfo',JSON.stringify(temp))
                }
            })
        }

        if(check) {
            sessionStorage.setItem('phoneInfo' , JSON.stringify(
                [
                    {
                        phoneName : name,
                        amountInput : 1,
                        option :phonePageOptionBtnIndex == 'unKnow'? phonePageOptionBtnIndex : phonePageOptionBtnIndex.dataset.index ,
                        color : phonePageColorBtnIndex == 'unKnow'? phonePageColorBtnIndex : phonePageColorBtnIndex.dataset.index ,
                    },
                    ...temp
                ]
            ))
            console.log(sessionStorage.phoneInfo);
            
        }
        window.location.href = "./cart.html"
    }
})
