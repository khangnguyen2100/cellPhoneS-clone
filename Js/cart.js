
const shoppingList = document.querySelector(".shopping-list")
const totalPriceEl = document.querySelector(".total-price")
const buyBtn = document.querySelector('.buy-btn')
let totalPrice = 0
var phoneInfo = []
if(sessionStorage.phoneInfo) {
    phoneInfo = JSON.parse(sessionStorage.phoneInfo)
}
var arrays = JSON.parse(sessionStorage.arrays)

const app = {
    start : function() {
        this.render()
        this.renderTotal()
        this.handleAmountInput()
        this.deleteItem()
    },
    handleAmountInput : function() {
        const decreaseBtns = document.querySelectorAll(".amount-minus")
        const increaseBtns = document.querySelectorAll(".amount-plus")
        const inputs = document.querySelectorAll(".amount-input")

        increaseBtns.forEach((increaseBtn,i) => {
            increaseBtn.addEventListener('click' ,() => {

                inputs[i].value++
                this.updateTotal(i , '+')

                amountShoppingList++
                amountNumEl.innerText = amountShoppingList

                phoneInfo[i].amountInput++
                sessionStorage.setItem('phoneInfo',JSON.stringify(phoneInfo))
            })
        })
        decreaseBtns.forEach((decreaseBtn,i) => {
            decreaseBtn.addEventListener('click' ,() => {
                if(inputs[i].value > 1) {

                    inputs[i].value--
                    this.updateTotal(i , '-')

                    amountShoppingList--
                    amountNumEl.innerText = amountShoppingList
                    
                    phoneInfo[i].amountInput--
                    sessionStorage.setItem('phoneInfo',JSON.stringify(phoneInfo))
                }
            })
        })
    },
    render : function() {
        if(phoneInfo.length == 0) return shoppingList.innerHTML = "<div class=message>Chưa có sản phẩm nào trong giỏ hàng</div>"

        const htmls = phoneInfo.map(obj => {
            const currentArray = filterPhoneName(arrays,obj.phoneName)
            img = currentArray.image.replace('cdn.cellphones.com.vn','cdn2.cellphones.com.vn/358x')

            return `
                    <li class="shopping-item">
                    <i class='fas fa-times remove-btn'></i>
                        <div class="item-img">
                            <img src="${img}"  onerror="this.onerror=null; this.src='./img/not_found.jpg';" alt="">
                        </div>
                        <div class="item-content">
                            <div class="item-name">
                                ${currentArray.name}
                            </div>
                            <div class="item-price">
                                ${formatPrice(currentArray.special_price || currentArray.old_price || currentArray.price)}
                            </div>
                            <div className="item-type">
                                ${obj.option !== 'unKnow' ? `Loại : ${obj.option}` : ''}
                                </div>
                            <div className="item-color">
                                ${obj.color !== 'unKnow' ? `Màu : ${obj.color}` : ''}
                            </div>
                            <div class="amount">
                                <p>Chọn số lượng:</p>
                                <div class="input-container">
                                    <div class="input-action amount-minus">
                                        -
                                    </div>
                                    <input type="text" value=${obj.amountInput} readonly class="amount-input">
                                    <div class="input-action amount-plus">
                                        +
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                ` 
        })
        shoppingList.innerHTML = htmls.join('')
    },
    renderTotal : function() {
        const phonePrices = document.querySelectorAll(".item-price")
        const inputs = document.querySelectorAll(".amount-input")
        totalPrice = 0

        phonePrices.forEach((phonePrice,i) => {
            const price = this.getPrice(phonePrice)
            const amountInput = +inputs[i].value
            
            totalPrice += price*amountInput
        })

        if(phonePrices.length == 0 ) totalPrice = 0
        totalPriceEl.innerText = ` ${nf.format(totalPrice)} đ`
    },
    updateTotal : function(i,operator) {  
        const phonePrice = document.querySelectorAll(".item-price")
        const price = this.getPrice(phonePrice[i])
        
        if(operator == '+') totalPrice+=price
        if(operator == '-') totalPrice-=price
        
        totalPriceEl.innerText = ` ${nf.format(totalPrice)} đ`
        
    },
    getPrice : function(ele) {
        return Number.parseInt(ele.innerText.replaceAll(',',''))
    },
    deleteItem : function() {
        const removeBtns = document.querySelectorAll(".remove-btn")
        removeBtns.forEach((removeBtn,i) => {

            removeBtn.addEventListener('click', ()=> {
                phoneInfo = phoneInfo.filter((arr,j) => {
                    if(j == i) {
                        amountShoppingList -= arr.amountInput
                        amountNumEl.innerText = amountShoppingList
                    }
                    return j !== i
                })

                sessionStorage.setItem('phoneInfo', JSON.stringify(phoneInfo))
                this.start()
            })
        })
    },
}
app.start()