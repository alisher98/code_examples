async function sendRequest() {
    this.event.preventDefault();
    let form = this.event.target;
    let reqBody = {
        name: form.name.value,
        address: form.address.value,
        phone: parseInt(form.phone.value, 10),
    };
    console.log('Request is: ', reqBody);
    fetch('https://secretof.art').then(() => {
        showSuccessModal();
        form.reset();
    })
}

function openModal() {
    let img = this.event.target;
    let modal = document.createElement('div');
    modal.id = 'modalContainer';
    modal.innerHTML = `
    <div onclick="closeModal()" class="mask" style="position:fixed; top: 0; right: 0; left: 0; bottom: 0; background: white; opacity: 0.9; z-index: 10"></div>
    <div style="position:fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 11">
        <img style="width: 100%; max-width: 30vw; height: auto" src="${img.src}" alt="img">
    </div>
    `

    document.body.style.overflow = 'hidden';
    document.body.appendChild(modal);
}

function closeModal() {
    document.body.style.overflow = 'auto';
    document.getElementById('modalContainer').remove();
}

function checkDot() {
    this.event.target.value = this.event.target.value.replaceAll('.', '');
}

function showSuccessModal() {
    let modal = document.createElement('div');
    modal.id = 'successModal';
    modal.innerHTML = `
    <div
    style="position: fixed;
    right: 50px;
    top: 50px;
    box-sizing: border-box;
    width: 250px;
    border: 1px solid #B99150;
    height: 60px;
    color: #CBA86E;
    font-size: 24px;
    text-align: left;
    padding: 20px">
        Спасибо за заказ!
        <div
         id="modalProgress" 
         style="position: absolute; 
         bottom: 0; 
         top: 55px; 
         left: 0; 
         width: 0; 
         transition: all 3s; 
         background: #FFAF18;"></div>
    </div>
    `;
    document.body.appendChild(modal);
    setTimeout(() => {
        document.getElementById('modalProgress').style.width = '250px';
    }, 10);
    setTimeout(() => {
        modal.remove();
    }, 3000)
}
