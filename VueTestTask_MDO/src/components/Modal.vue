<script>
export default {
  name: "ModalComponent",
};
</script>

<template>
  <div class="modal">
    <div id="mask" @click="$emit('close')"></div>
    <div class="application-modal">
      <div class="application-modal__header">
        <h1>Создание заявки</h1>
        <p>Новая</p>
      </div>
      <div class="application-modal__form">
        <form @submit="$emit('close')">
          <div
            class="application-modal__form__item application-modal__form__first"
          >
            <label>
              <span>Тип недвижимости</span>
              <select>
                <option value="">Выберите тип</option>
                <option value="house">Дом</option>
                <option value="apartment">Квартира</option>
              </select>
            </label>
            <label>
              <span>Статус</span>
              <select>
                <option value="new">Новая</option>
                <option value="in-progress">В процессе</option>
              </select>
            </label>
            <label>
              <span>Срок</span>
              <input type="text" placeholder="Введите срок" />
            </label>
          </div>
          <div
            class="application-modal__form__item application-modal__form__second"
          >
            <label>
              <span>Фамилия</span>
              <input type="text" placeholder="Введите фамилию" />
            </label>
            <label>
              <span>Имя</span>
              <input type="text" placeholder="Введите имя" />
            </label>
            <label>
              <span>Отчество</span>
              <input type="text" placeholder="Введите отчество" />
            </label>
            <label>
              <span>Телефон</span>
              <input type="tel" placeholder="Введите телефон" />
            </label>
          </div>
          <label>
            <span>Описание заявки</span>
            <textarea rows="5" placeholder="Введите описание заявки"></textarea>
          </label>

          <div class="submit-btn">
            <button type="submit">Сохранить</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;

  #mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
  }
}
.application-modal {
  z-index: 1001;
  margin: 0 auto;
  padding: 24px 32px;
  border-radius: 8px;
  background: #ffffff;
  width: 740px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

select,
input,
textarea {
  width: 100%;
  outline: none;
  border: none;
  border-bottom: 1px solid #cccccc;
  padding-bottom: 17px;
  color: #999999;
  font-size: 14px;
  font-weight: 400;
}

select {
  padding-bottom: 17px;
  -webkit-appearance: none;
  -moz-appearance: none;
  padding-left: 0;
}

input,
textarea {
  padding-left: 0;
}

input::placeholder,
textarea::placeholder {
  color: #999999;
  font-size: 14px;
  font-weight: 400;
}

textarea {
  resize: vertical;
}

.application-modal__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.application-modal__header p {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
}

.application-modal__header h1 {
  font-weight: 600;
  font-size: 16px;
  color: #333333;
}

.application-modal__form {
  form {
    display: flex;
    flex-direction: column;
    gap: 32px;
  }
}

.application-modal__form__item {
  display: flex;
  gap: 14px;
  justify-content: space-between;
}

.application-modal__form__first label {
  width: 33%;
}

.application-modal__form__second label {
  width: 25%;
}

label span {
  color: #50b053;
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
}

.submit-btn {
  text-align: right;
}

.submit-btn button {
  cursor: pointer;
  box-shadow: 0 4px 4px 0 rgba(106, 174, 94, 0.25);
  border: none;
  background: #50b053;
  border-radius: 2px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 400;
  height: 36px;
  width: 102px;
}
</style>
